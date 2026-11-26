// SPDX-License-Identifier: CC0-1.0

//! The data a DB cluster holds THROUGH THE RDS DATA API, as a snapshot of that cluster
//! carries it.
//!
//! A DB cluster snapshot is "a storage volume snapshot of your DB cluster", so it holds the
//! cluster's DATA — every database the cluster serves — and a cluster restored from it
//! serves exactly that data. One of the surfaces a client writes an Aurora cluster's
//! databases through is the RDS Data API, whose service OWNS the databases it serves: they
//! are its state, keyed by the ARN of the cluster a call addresses. So a snapshot taken
//! here has to carry those databases too, and a restore has to install them on the cluster
//! it creates — otherwise a client that wrote its rows through the Data API restores a
//! cluster that serves none of them.
//!
//! This module is that hand-off, and nothing else: the copy is MADE and INSTALLED by the
//! service that owns those databases
//! (`service_com_amazonaws_rdsdata_rdsdataservice::state::cluster_copies`, with the engine's
//! own copy), on the SAME shared engine this service's state lives in, and what travels
//! across is the opaque copy that service hands back. This service neither reads nor writes
//! a database of it.
//!
//! Both calls are AWAITED on a blocking task, exactly as the capture of a cluster's own
//! storage is ([`super::data_plane::capture_cluster_storage`]): copying a database is engine
//! work, so it belongs off the runtime's worker threads — and neither may be called with
//! this service's own store locked, because each takes the Data API's store. `Err` carries
//! what went wrong, which a handler answers as a failure of this emulator rather than
//! storing a snapshot that holds less than the cluster did.
//!
//! An emulator assembled WITHOUT the Data API has no such databases, and a cluster nobody
//! ran a Data API statement against holds none: both answer `Ok(None)`, which is what a
//! snapshot of such a cluster carries.

use std::sync::Arc;

/// The copy itself, as the service that owns those databases hands it over: opaque here, and
/// kept on the snapshot record that holds it ([`super::DbClusterSnapshotRecord`]).
pub type DataApiClusterData =
    ::service_com_amazonaws_rdsdata_rdsdataservice::state::CapturedClusterData;

/// A COPY of every database the Data API holds for the DB cluster `cluster_arn` names,
/// right now — what a DB cluster snapshot of that cluster carries.
///
/// `Ok(None)` for a cluster the Data API holds no database for, which is a snapshot that
/// carries none. Call it BEFORE this service's store is locked, as the storage capture
/// beside it is.
pub async fn capture_data_api_cluster_data<Eng: Send + Sync + 'static>(
    engine: &Eng,
    cluster_arn: &str,
) -> Result<Option<Arc<DataApiClusterData>>, String> {
    let Some(store) = ::service_com_amazonaws_rdsdata_rdsdataservice::state::service_state(engine)
    else {
        return Ok(None);
    };
    let cluster_arn = cluster_arn.to_string();
    let captured = crate::state::cpu_bound::run(move || {
        store.lock().capture_cluster_data(&cluster_arn)
    })
    .await
    .map_err(|error| format!("the DB cluster's Data API databases could not be copied: {error}"))?;
    match captured {
        Ok(captured) => Ok(captured.map(Arc::new)),
        Err(error) => Err(format!(
            "the DB cluster's Data API databases could not be copied: {}",
            error.message()
        )),
    }
}

/// Make the databases the Data API serves for the DB cluster `cluster_arn` names be exactly
/// what `captured` holds — a fresh copy of each, and no other.
///
/// This is the restore half: a cluster restored from a snapshot serves the snapshot's
/// databases, and one restored from a snapshot that carries none serves none. `captured` is
/// left intact, so the same snapshot restores again. Call it with this service's store
/// unlocked.
pub async fn install_data_api_cluster_data<Eng: Send + Sync + 'static>(
    engine: &Eng,
    cluster_arn: &str,
    captured: Option<Arc<DataApiClusterData>>,
) -> Result<(), String> {
    let Some(store) = ::service_com_amazonaws_rdsdata_rdsdataservice::state::service_state(engine)
    else {
        // Nothing serves those databases in this emulator, so there is nothing to install
        // them on — and a snapshot that carries none asks for nothing either way.
        return Ok(());
    };
    let cluster_arn = cluster_arn.to_string();
    let installed = crate::state::cpu_bound::run(move || {
        store
            .lock()
            .install_cluster_data(&cluster_arn, captured.as_deref())
    })
    .await
    .map_err(|error| {
        format!("the DB cluster's Data API databases could not be restored: {error}")
    })?;
    installed.map_err(|error| {
        format!(
            "the DB cluster's Data API databases could not be restored: {}",
            error.message()
        )
    })
}

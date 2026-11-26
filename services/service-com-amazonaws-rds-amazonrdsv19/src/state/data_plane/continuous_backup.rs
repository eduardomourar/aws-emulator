// SPDX-License-Identifier: CC0-1.0

//! The CONTINUOUS BACKUP of a DB instance: the recovery points its data can be restored
//! to, and the engine work that records one.
//!
//! `BackupRetentionPeriod` is what turns continuous backup on — "setting this parameter to
//! a positive number enables backups" — and what it buys is
//! `RestoreDBInstanceToPointInTime`: "you can restore to any point in time before the time
//! identified by the `LatestRestorableTime` property". So an instance that keeps automated
//! backups keeps, for each instant it was in a different state, the data it held then; a
//! restore to an instant serves the data as of that instant, which is what makes the
//! restored instance a recovery of the source rather than a copy of it.
//!
//! What a recovery point IS here: a COPY of the instance's databases, taken by the engine's
//! own online backup ([`super::sql_engine::InstanceDatabase::capture`]) — the same copy a
//! DB snapshot holds — recorded at the instant a session COMMITTED a change on the
//! instance's endpoint. Between two commits an instance's data does not change, so the copy
//! taken at the last commit at or before an instant is exactly the data the instance held at
//! that instant. The points are kept on the instance's own record, so they go with the
//! instance when it is deleted, and they are bounded two ways: a point older than the
//! retention period is one the instance can no longer be restored to and is dropped, and at
//! most [`MAX_RECOVERY_POINTS`] are kept at all.
//!
//! An instance with automated backups OFF keeps none — "setting this parameter to 0 disables
//! automated backups" — which is the case `PointInTimeRestoreNotEnabledFault` is answered
//! for.

use std::sync::Arc;

use super::sql_engine::InstanceDatabase;
use super::wire_session::SessionTarget;
use crate::state::{ComAmazonawsRdsAmazonrdsv19State, DbInstanceRecord};

/// How many recovery points one DB instance's continuous backup keeps.
///
/// A client decides how often it commits, so the points are a ring: past this many the
/// oldest goes, exactly as the retention period drops one that has aged out. The instance
/// can be restored to any instant from its oldest kept point on
/// ([`DbInstanceRecord::earliest_recovery_point`]), which is what a restore refuses an
/// earlier instant against.
pub const MAX_RECOVERY_POINTS: usize = 32;

/// One recovery point: the data the instance held at `at`.
#[derive(Debug, Clone)]
pub struct RecoveryPoint {
    /// The instant the instance's data was in this state from, to the MICROSECOND the
    /// modelled timestamp shapes carry one at ([`to_the_published_precision`]): the instant a
    /// client reads as `LatestRestorableTime` is the instant it can then name as
    /// `RestoreTime`, so the two cannot be a fraction apart.
    pub at: ::aws_smithy_types::DateTime,
    /// The copy of the instance's databases taken then, which a restore loads.
    pub storage: Arc<InstanceDatabase>,
}

/// `at` as the modelled timestamp shapes carry one: the whole microseconds of it.
///
/// A recovery point is named back to this service as a `RestoreTime` the client read off
/// `LatestRestorableTime`, so the instant the point holds has to be one that survives being
/// written to the wire and read back — anything finer than the wire form is a fraction a
/// client could never name.
#[must_use]
pub fn to_the_published_precision(at: ::aws_smithy_types::DateTime) -> ::aws_smithy_types::DateTime {
    ::aws_smithy_types::DateTime::from_secs_and_nanos(
        at.secs(),
        at.subsec_nanos() / 1_000 * 1_000,
    )
}

/// Whether `point` is at or before `target`, compared at the precision above rather than as
/// a floating-point number of seconds: two instants a microsecond apart are ordered, and one
/// instant written to the wire and read back is the SAME instant.
#[must_use]
pub fn is_at_or_before(
    point: ::aws_smithy_types::DateTime,
    target: ::aws_smithy_types::DateTime,
) -> bool {
    microseconds(point) <= microseconds(target)
}

/// `at` as whole microseconds since the epoch.
fn microseconds(at: ::aws_smithy_types::DateTime) -> i128 {
    i128::from(at.secs()) * 1_000_000 + i128::from(at.subsec_nanos() / 1_000)
}

impl DbInstanceRecord {
    /// Whether this instance keeps continuous backups at all: "setting this parameter to a
    /// positive number enables backups", so a non-zero `BackupRetentionPeriod` is what makes
    /// a point-in-time restore of it possible.
    #[must_use]
    pub fn keeps_continuous_backups(&self) -> bool {
        self.backup_retention_period >= 1
    }

    /// Record the data this instance holds at `at`, dropping the points it can no longer be
    /// restored to.
    ///
    /// Nothing is kept for an instance with automated backups off, and the points it kept
    /// before they were turned off are dropped: there is no instant such an instance can be
    /// restored to.
    pub fn record_recovery_point(&mut self, at: ::aws_smithy_types::DateTime, storage: Arc<InstanceDatabase>) {
        if !self.keeps_continuous_backups() {
            self.recovery_points.clear();
            return;
        }
        let at = to_the_published_precision(at);
        self.recovery_points.push(RecoveryPoint { at, storage });
        // "You can restore to a point up to the number of days specified by the
        // BackupRetentionPeriod property": a point older than that window is one this
        // instance can no longer be restored to.
        let window = f64::from(self.backup_retention_period) * 24.0 * 60.0 * 60.0;
        let cutoff = at.as_secs_f64() - window;
        while self.recovery_points.len() > 1
            && self
                .recovery_points
                .first()
                .is_some_and(|point| point.at.as_secs_f64() < cutoff)
        {
            self.recovery_points.remove(0);
        }
        while self.recovery_points.len() > MAX_RECOVERY_POINTS {
            self.recovery_points.remove(0);
        }
    }

    /// The point a restore to `target` serves the data of: the latest one taken at or before
    /// that instant, which is the state the instance's data was in then.
    ///
    /// `None` when every point this instance kept is NEWER than `target` — an instant whose
    /// data it no longer holds — and for an instance that has recorded no point at all, whose
    /// data has not changed since it came up.
    #[must_use]
    pub fn recovery_point_at(&self, target: ::aws_smithy_types::DateTime) -> Option<&RecoveryPoint> {
        self.recovery_points
            .iter()
            .rfind(|point| is_at_or_before(point.at, target))
    }

    /// The newest point this instance kept, which is what `UseLatestRestorableTime` restores
    /// from; `None` for an instance that has recorded none.
    #[must_use]
    pub fn latest_recovery_point(&self) -> Option<&RecoveryPoint> {
        self.recovery_points.last()
    }

    /// The oldest instant this instance can be restored to, or `None` for one that has
    /// recorded no point: its data has not changed since it came up, so every instant of its
    /// lifetime serves the same data.
    #[must_use]
    pub fn earliest_recovery_point(&self) -> Option<::aws_smithy_types::DateTime> {
        self.recovery_points.first().map(|point| point.at)
    }
}

/// Record the data a DB instance COMES UP with as the first recovery point of its continuous
/// backup: the state every instant before its first commit resolves to, so a restore of such
/// an instant serves the data the instance started from and never a later commit's.
///
/// The copy is the engine's own, taken from the endpoint that has just been opened — `Ok(None)`
/// for an engine this emulator serves no data plane for, which has no storage to copy — and
/// nothing is kept for an instance with automated backups off. Call it with NO store guard
/// held: it awaits the copy on a blocking task, exactly as every other capture does.
pub async fn record_initial_state(record: &mut DbInstanceRecord, endpoint: Option<&super::DbEngineEndpoint>) {
    if !record.keeps_continuous_backups() {
        return;
    }
    let Some(endpoint) = endpoint else { return };
    match super::capture_endpoint_storage(endpoint).await {
        Ok(Some(initial)) => {
            record.record_recovery_point(crate::state::now_as_wire_timestamp(), initial);
        }
        Ok(None) => {}
        Err(error) => ::tracing::info!(
            operation = "DbInstanceContinuousBackup",
            outcome = "not-recorded",
            reason = %error,
            "the data this instance came up with could not be recorded as a recovery point"
        ),
    }
}

/// Record what the DB instance `target` names has just COMMITTED as a recovery point of its
/// continuous backup. Does nothing for an endpoint of any other resource, and for an
/// instance that keeps no automated backups.
///
/// The store's guard is taken only to read whether the instance keeps backups and, at the
/// end, to record the point; the COPY itself is engine work, so it runs on a blocking task
/// under the engine's own copy deadline and page ceiling, exactly as the capture a snapshot
/// takes does. Nothing of the client's statement depends on its outcome: a copy the engine
/// could not take leaves the instance with the points it already had, and is recorded in this
/// service's own tracing.
pub async fn record_committed_state(
    state: &::engine::ServiceState<ComAmazonawsRdsAmazonrdsv19State>,
    target: &SessionTarget,
    storage: &Arc<InstanceDatabase>,
) {
    let SessionTarget::DbInstance {
        region,
        resource_id,
    } = target
    else {
        return;
    };
    let keeps_backups = state
        .lock()
        .instance_by_resource_id(region, resource_id)
        .is_some_and(DbInstanceRecord::keeps_continuous_backups);
    if !keeps_backups {
        return;
    }
    let source = Arc::clone(storage);
    let captured = crate::state::cpu_bound::run(move || source.capture()).await;
    let copy = match captured {
        Ok(Ok(copy)) => Arc::new(copy),
        Ok(Err(error)) => {
            ::tracing::info!(
                operation = "DbInstanceContinuousBackup",
                outcome = "not-recorded",
                reason = %error.message,
                "a committed change could not be recorded as a recovery point"
            );
            return;
        }
        Err(error) => {
            ::tracing::info!(
                operation = "DbInstanceContinuousBackup",
                outcome = "not-recorded",
                reason = %error,
                "a committed change could not be recorded as a recovery point"
            );
            return;
        }
    };
    let at = crate::state::now_as_wire_timestamp();
    let mut store = state.lock();
    if let Some(record) = store.instance_by_resource_id_mut(region, resource_id) {
        record.record_recovery_point(at, copy);
    }
}

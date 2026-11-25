// SPDX-License-Identifier: CC0-1.0

//! The DATA PLANE of an Amazon MQ for RabbitMQ broker: the socket its clients connect
//! to, the message broker behind that socket, and the address the control plane
//! publishes for it.
//!
//! An endpoint a service advertises is an address the service ANSWERS on. A name under
//! Amazon MQ's own DNS zone resolves to nothing on the machine this emulator runs on, so
//! a broker that reported one published an address no client could reach — the one thing
//! a published endpoint must never be. So every RabbitMQ broker this emulator creates is
//! given a socket of the EMULATOR's own, opened through the core
//! (`engine.listeners().tcp`, which owns the socket, the bind interface, the port range,
//! the TLS and the connection caps), and the address that socket answers on is what the
//! broker's one `BrokerInstance` publishes as its `amqps://` endpoint. An `amqps://`
//! endpoint is TLS from the first byte, which is exactly what the core's `tcp` listener
//! serves, and what answers on it is the AMQP 0-9-1 server [`amqp_session`] runs over the
//! exchanges and queues [`message_broker`] holds.
//!
//! The socket's life is the broker's: the handle lives on the store under the broker's
//! own id, and dropping it (the delete) closes the port and severs every connection on
//! it.
//!
//! An ActiveMQ broker gets none: its clients speak OpenWire, STOMP, MQTT and AMQP 1.0,
//! none of which is the wire served here, so such a broker keeps publishing the ports
//! Amazon MQ publishes for those protocols rather than an address that would answer the
//! wrong protocol.

/// The AMQP 0-9-1 server one connection is served by.
///
/// Built on `amq-protocol`, whose `amq-protocol-tcp` dependency pulls in `async-rs` —
/// a raw-fd socket abstraction with no `wasm32` backend at all, not even with every
/// feature off. A `wasm32` build never opens a real socket for this anyway
/// (`engine.listeners().tcp` already refuses there), so the module is native-only and
/// [`serve_broker`] below is a wasm no-op with the same observable effect: a broker
/// that never gets a socket of its own.
#[cfg(not(target_family = "wasm"))]
pub mod amqp_session;
/// The exchanges, queues and messages that server answers out of.
#[cfg(not(target_family = "wasm"))]
pub mod message_broker;

#[cfg(not(target_family = "wasm"))]
use std::sync::{Arc, Mutex, MutexGuard, PoisonError};

use super::*;

#[cfg(not(target_family = "wasm"))]
use message_broker::MessageBroker;

/// The address a broker's own socket answers on, as the control plane publishes it.
///
/// The host and the port come from the CORE listener, never from a `format!` of a service
/// hostname: it is the one address a client on this machine can reach the broker at.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ServedAddress {
    pub host: String,
    pub port: u16,
}

/// One broker's exchanges and queues, shared between the store's record and every
/// session on the broker's socket.
///
/// A newtype rather than a bare `Arc<Mutex<_>>` so locking recovers from a poisoned lock
/// the way the engine's own state handle does: one session that panicked must not wedge
/// the broker for every later client.
#[cfg(not(target_family = "wasm"))]
#[derive(Debug, Clone, Default)]
pub struct SharedMessageBroker(Arc<Mutex<MessageBroker>>);

#[cfg(not(target_family = "wasm"))]
impl SharedMessageBroker {
    /// Lock the broker for exclusive access.
    pub fn lock(&self) -> MutexGuard<'_, MessageBroker> {
        self.0.lock().unwrap_or_else(PoisonError::into_inner)
    }
}

/// One broker's data plane, as the store holds it: where it answers, what it holds, and
/// the socket's handle.
///
/// Dropping it closes the port, so it is held for exactly as long as the broker it
/// belongs to.
#[cfg(not(target_family = "wasm"))]
pub struct BrokerDataPlane {
    endpoint: ServedAddress,
    broker: SharedMessageBroker,
    /// The socket itself. Never read: it is held because dropping it closes the port.
    _listener: ::emulator_server::ResourceListener,
}

#[cfg(not(target_family = "wasm"))]
impl std::fmt::Debug for BrokerDataPlane {
    /// Everything about this record that is not a live socket: where it answers and what
    /// its broker holds. `ResourceListener` is not `Debug`.
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        formatter
            .debug_struct("BrokerDataPlane")
            .field("endpoint", &self.endpoint)
            .field("broker", &self.broker)
            .finish_non_exhaustive()
    }
}

#[cfg(not(target_family = "wasm"))]
impl BrokerDataPlane {
    /// The address a client reaches this broker at.
    pub fn endpoint(&self) -> &ServedAddress {
        &self.endpoint
    }

    /// The broker's exchanges and queues.
    pub fn broker(&self) -> &SharedMessageBroker {
        &self.broker
    }
}

/// A `wasm32` build never opens a real broker socket ([`serve_broker`] is a no-op
/// there), so [`Self::broker_data_planes`](super::ComAmazonawsMqMqState::broker_data_planes)
/// never holds one of these — it exists only so that map's value type compiles.
#[cfg(target_family = "wasm")]
#[derive(Debug)]
pub struct BrokerDataPlane {
    _never_constructed: ::std::convert::Infallible,
}

/// Whether this emulator serves a data plane for a broker running `engine_type`.
///
/// RabbitMQ brokers speak AMQP 0-9-1, which is the wire [`amqp_session`] serves. An
/// ActiveMQ broker's clients speak protocols this emulator has nothing to answer with,
/// so such a broker gets no socket of its own.
pub fn engine_speaks_amqp_0_9_1(engine_type: &str) -> bool {
    engine_type == ENGINE_TYPE_RABBITMQ
}

/// Open the socket a RabbitMQ broker is served on and publish its address on the
/// broker's record, so the endpoint its `BrokerInstance` reports is one a client can
/// reach.
///
/// Called by the create once the record is stored. Does nothing for a broker that
/// already has a socket, for a broker whose engine this emulator serves no wire for, or
/// on an engine that vends no listeners — in which case the broker publishes the port
/// Amazon MQ publishes for its protocol on the host this emulator answered the create
/// on.
///
/// `wasm32` never reaches a real socket here regardless (see the module doc above), so
/// this is a no-op there — the same observable outcome as the native "no socket could
/// be opened" branch below.
#[cfg(target_family = "wasm")]
pub async fn serve_broker<Eng: Send + Sync + 'static>(
    _engine: &Eng,
    _state: &::engine::ServiceState<ComAmazonawsMqMqState>,
    _broker_id: &str,
) {
}

#[cfg(not(target_family = "wasm"))]
pub async fn serve_broker<Eng: Send + Sync + 'static>(
    engine: &Eng,
    state: &::engine::ServiceState<ComAmazonawsMqMqState>,
    broker_id: &str,
) {
    {
        let store = state.lock();
        let Some(broker) = store.brokers.get(broker_id) else {
            return;
        };
        if !engine_speaks_amqp_0_9_1(&broker.engine_type) {
            return;
        }
        if store.broker_data_planes.contains_key(broker_id) {
            return;
        }
    }
    let Some(shared) = (engine as &dyn ::std::any::Any).downcast_ref::<::engine::InMemoryEngine>()
    else {
        ::tracing::warn!(
            broker_id,
            "this engine vends no listeners, so the broker publishes the port Amazon MQ \
             publishes for its protocol rather than a socket of this emulator's own"
        );
        return;
    };
    let listeners = shared.listeners();
    let message_broker = SharedMessageBroker::default();
    let handler = amqp_session::AmqpWire::new(amqp_session::BrokerSocket {
        state: state.clone(),
        broker_id: broker_id.to_string(),
        broker: message_broker.clone(),
    });
    // Opened on a task of its OWN, so a runtime that cannot bind a socket at all — one
    // built with no IO driver, which is what a host driving this emulator in process may
    // hand a request — leaves this create without an address of its own instead of taking
    // the request down with it.
    let opened = ::tokio::spawn(async move { listeners.tcp(handler).await.ok() }).await;
    let Some(listener) = opened.ok().flatten() else {
        ::tracing::warn!(
            broker_id,
            "no socket could be opened for this broker, so it publishes the port Amazon MQ \
             publishes for its protocol rather than a socket of this emulator's own"
        );
        return;
    };
    // The address the CORE says the listener is dialable at, read through the one shared
    // reading of it: a wildcard bind has no single address to dial and is published as
    // loopback, and an IPv6 bind keeps its brackets.
    let authority = ::service_common::data_plane_addressing::listener_authority(&listener);
    let host = ::service_common::data_plane_addressing::host_only(&authority).to_string();
    let port = ::service_common::data_plane_addressing::addressed_port(Some(&authority))
        .and_then(|port| u16::try_from(port).ok())
        .unwrap_or_else(|| listener.port());
    let endpoint = ServedAddress { host, port };
    let mut store = state.lock();
    if let Some(record) = store.brokers.get_mut(broker_id) {
        record.served_amqps = Some(endpoint.clone());
    }
    store.broker_data_planes.insert(
        broker_id.to_string(),
        BrokerDataPlane {
            endpoint,
            broker: message_broker,
            _listener: listener,
        },
    );
}

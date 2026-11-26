// SPDX-License-Identifier: CC0-1.0

// Not from Floci UI's own source (unlike the rest of this directory — see its
// README): Floci's real backend has an activity feed with its own persistent
// store; this embedded build has no server to persist anything across page
// loads, and no generic `routes/clouds.ts` adapter method this build's other
// bundles could call to get one either. This module is a from-scratch,
// in-memory stand-in, scoped to exactly what `ActivityPage.tsx`'s own query
// (`GET /api/activity`) needs: `router.js` calls `recordActivity` after every
// mutating call it dispatches to a per-service bundle, and `handleActivityRequest`
// answers this module's own in-memory log of those, filtered and paginated the
// same way the real endpoint's query parameters say it should be.
//
// Session-lived only: a reload of the page starts the log over, same as every
// other piece of in-memory state this embedded build holds (the emulator's own
// resources included) — there is nowhere else for it to live.

const MAX_ENTRIES = 500;

/** @type {Array<{id:string,timestamp:string,cloud:string,service:string,resourceType?:string,resourceName?:string,operation:string,status:"success"|"failed",detail?:string,source:string}>} */
const entries = [];

let nextId = 1;

/**
 * Appends one entry to the in-memory log, newest first, capped at
 * `MAX_ENTRIES` (drops the OLDEST entry once full — a feed is read starting
 * from the newest, so that is the one direction that can never surprise a
 * reader mid-page).
 */
export function recordActivity({ cloud, service, operation, status, resourceType, resourceName, detail, source }) {
  entries.unshift({
    id: `activity-${nextId++}`,
    timestamp: new Date().toISOString(),
    cloud,
    service,
    resourceType,
    resourceName,
    operation,
    status,
    detail,
    source,
  });
  entries.length = Math.min(entries.length, MAX_ENTRIES);
}

function matches(entry, filters) {
  if (filters.cloud && entry.cloud !== filters.cloud) return false;
  if (filters.service && entry.service !== filters.service) return false;
  if (filters.operation && entry.operation !== filters.operation) return false;
  if (filters.status && entry.status !== filters.status) return false;
  if (filters.resourceType && entry.resourceType !== filters.resourceType) return false;
  if (filters.from && entry.timestamp < filters.from) return false;
  if (filters.to && entry.timestamp > filters.to) return false;
  if (filters.search) {
    const needle = filters.search.toLowerCase();
    const haystack = `${entry.service} ${entry.operation} ${entry.resourceName ?? ""} ${entry.detail ?? ""}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

// `ActivityPage.tsx` offers every filter's OWN option list from this, so a
// value the current filters have already excluded stays choosable (clearing a
// different filter can bring its matches back) — computed from the WHOLE log,
// never the already-filtered result set.
function facetsOf(all) {
  const services = new Set(), operations = new Set(), resourceTypes = new Set();
  for (const entry of all) {
    services.add(entry.service);
    operations.add(entry.operation);
    if (entry.resourceType) resourceTypes.add(entry.resourceType);
  }
  return {
    services: [...services].sort(),
    operations: [...operations].sort(),
    resourceTypes: [...resourceTypes].sort(),
  };
}

export async function handleActivityRequest(request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const filters = {
    cloud: params.get("cloud") || undefined,
    service: params.get("service") || undefined,
    operation: params.get("operation") || undefined,
    status: params.get("status") || undefined,
    resourceType: params.get("resourceType") || undefined,
    search: params.get("search") || undefined,
    from: params.get("from") || undefined,
    to: params.get("to") || undefined,
  };
  const limit = Math.min(Math.max(Number(params.get("limit")) || 50, 1), 200);
  const cursor = params.get("cursor");

  const matching = entries.filter((entry) => matches(entry, filters));
  const start = cursor ? Math.max(matching.findIndex((entry) => entry.id === cursor) + 1, 0) : 0;
  const page = matching.slice(start, start + limit);
  const nextCursor = start + limit < matching.length ? page[page.length - 1]?.id ?? null : null;

  return new Response(
    JSON.stringify({ items: page, nextCursor, facets: facetsOf(entries) }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}

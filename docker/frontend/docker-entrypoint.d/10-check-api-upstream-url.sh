#!/bin/sh
# ADR-015 decision 4 (docs/product/ARCHITECTURE.md §10) — T-C10-79.
#
# Runs inside the official nginx:alpine image's own /docker-entrypoint.d/
# mechanism, sorted before 20-envsubst-on-templates.sh (this file's "10-"
# prefix, docker-entrypoint.sh dispatches *.sh in `sort -V` order) — so a bad
# API_UPSTREAM_URL is caught before nginx.conf is even rendered, let alone
# before nginx starts. Two ways a broken value would otherwise fail
# silently instead of loudly:
#   - unset/empty: the rendered `set $sport_itsm_api_upstream ;` is a syntax
#     error nginx would report, but only once startup gets that far, and
#     with a message about nginx.conf, never about the missing environment
#     variable.
#   - a value with a path or a trailing slash (e.g.
#     "https://x.onrender.com/"): nginx's own `proxy_pass $variable;`
#     semantics then rewrite the whole request URI to that path fragment on
#     every request instead of forwarding the original URI unchanged — no
#     startup error at all, just every proxied call quietly landing on the
#     API's root route (Trap 3, T-C10-79).
#
# Must be made executable in docker/frontend/Dockerfile (`COPY --chmod=755`
# or an explicit `RUN chmod`): the base image's own docker-entrypoint.sh
# *silently ignores* a /docker-entrypoint.d/*.sh script without the
# executable bit ("Ignoring $f, not executable") — without the exec bit this
# check would never run and never be reported as skipped either.

set -eu

if [ -z "${API_UPSTREAM_URL:-}" ]; then
  echo "10-check-api-upstream-url.sh: ERROR: API_UPSTREAM_URL is not set." >&2
  echo "10-check-api-upstream-url.sh: Set it to the API's origin only, e.g. http://api:3300 or https://<api-service>.onrender.com (no path, no trailing slash)." >&2
  exit 1
fi

case "$API_UPSTREAM_URL" in
  http://*/* | https://*/*)
    echo "10-check-api-upstream-url.sh: ERROR: API_UPSTREAM_URL=\"$API_UPSTREAM_URL\" has a path or a trailing slash." >&2
    echo "10-check-api-upstream-url.sh: proxy_pass with a variable forwards the request URI unchanged only when the upstream has no path of its own — a trailing slash would silently rewrite every proxied request to \"/\"." >&2
    echo "10-check-api-upstream-url.sh: Set it to the origin only, e.g. http://api:3300 or https://<api-service>.onrender.com" >&2
    exit 1
    ;;
  http://* | https://*)
    ;;
  *)
    echo "10-check-api-upstream-url.sh: ERROR: API_UPSTREAM_URL=\"$API_UPSTREAM_URL\" must start with http:// or https://." >&2
    exit 1
    ;;
esac

echo "10-check-api-upstream-url.sh: API_UPSTREAM_URL=\"$API_UPSTREAM_URL\" OK."

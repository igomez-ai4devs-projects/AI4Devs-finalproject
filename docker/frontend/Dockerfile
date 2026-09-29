# Production image for apps/web — served by nginx, no Node runtime and no
# build stage. Expects `dist/apps/web` to already exist in the build context:
# build it first with `pnpm nx build web` (locally, or as the pipeline's build
# step once one exists).
FROM nginx:alpine

# ADR-015 decision 4 (docs/product/ARCHITECTURE.md §10, T-C10-79) — nginx.conf
# is rendered from a template at container start, not copied statically: the
# API's origin (API_UPSTREAM_URL) is runtime configuration, not a build
# input, so this same image runs unmodified against
# docker-compose.stage.yml's `http://api:3300` locally and Render's own
# `https://<api-service>.onrender.com` in production.

# Not the image's own default output directory (/etc/nginx/conf.d):
# docker/frontend/nginx.conf.template renders the WHOLE nginx.conf, `http {}`
# block included, and that file has no `include conf.d/*.conf` — a template
# left at the default output directory would render but nginx would never
# load it.
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx

# Restricts envsubst's substitution to exactly the two variables the template
# declares (`awk 'name ~ filter'` inside the base image's own
# 20-envsubst-on-templates.sh). Every nginx variable the template also uses
# ($uri, $host, $scheme, $proxy_host, $http_x_forwarded_proto, …) is not on
# this list, so envsubst leaves each one untouched regardless of `$name` or
# `${name}` form, instead of relying on none of them ever colliding with a
# container environment variable of the same name.
ENV NGINX_ENVSUBST_FILTER="^(API_UPSTREAM_URL|NGINX_LOCAL_RESOLVERS)\$"

# Activates the base image's own /docker-entrypoint.d/15-local-resolvers.envsh
# (nginx:alpine, not written by this ticket): it exports NGINX_LOCAL_RESOLVERS
# from every `nameserver` line of /etc/resolv.conf, with an IPv6 address
# already bracketed for the `resolver` directive — reused instead of a
# second, hand-rolled script reading the same file, and resolver-set-complete
# (every nameserver, not only the first).
ENV NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1

COPY docker/frontend/nginx.conf.template /etc/nginx/templates/nginx.conf.template

# Shared security-header `add_header` lines, `include`d by the rendered
# nginx.conf at `server` level and again inside every location that sets its
# own `add_header` (see docker/frontend/security-headers.conf and
# nginx.conf.template for why). Plain static config — no `${...}`
# placeholder — so it is COPYed directly rather than routed through
# /etc/nginx/templates/ and envsubst.
COPY docker/frontend/security-headers.conf /etc/nginx/security-headers.conf

# Fails the container before nginx ever starts when API_UPSTREAM_URL is
# unset, or shaped in a way `location /api/`'s `proxy_pass $variable;`
# cannot safely handle (a path or a trailing slash — see the script).
# `--chmod=755`: a /docker-entrypoint.d/*.sh script without the executable
# bit is *silently ignored* by the base image's own entrypoint, which would
# turn this check into a no-op instead of a startup failure.
COPY --chmod=755 docker/frontend/docker-entrypoint.d/10-check-api-upstream-url.sh /docker-entrypoint.d/10-check-api-upstream-url.sh

# Angular's esbuild builder (@angular/build:application) outputs the static
# site under a `browser/` subdirectory.
COPY dist/apps/web/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

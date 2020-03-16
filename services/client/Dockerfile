ARG node_version=12.14.1
ARG nginx_version=1.17.7

# --- BUILD ---

FROM node:${node_version} as build

WORKDIR /usr/src/app

COPY yarn.lock services/client/package.json ./
RUN yarn install --pure-lockfile --no-cache
COPY services/client/src ./src
COPY services/client/public ./public
COPY services/client/config-overrides.js ./

RUN SKIP_PREFLIGHT_CHECK=true yarn build

# --- SERVE ---

FROM nginx:${nginx_version}-alpine

COPY services/client/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html

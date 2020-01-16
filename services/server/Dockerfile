ARG node_version=12.14.1

FROM node:${node_version}

WORKDIR /usr/src/app
EXPOSE 80

COPY yarn.lock services/server/package.json ./
RUN yarn install --pure-lockfile --no-cache
COPY services/server .

CMD PORT=80 yarn start

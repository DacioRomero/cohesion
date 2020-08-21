# [Cohesion](https://cohesion.dacio.app)

A webapp for finding game you can play with your friends

# Getting started

1. Install
   - [Docker](https://www.docker.com/get-started/)
   - [Docker Compose](https://docs.docker.com/compose/install/)
1. Get
   - [Steam API key](https://steamcommunity.com/dev/apikey)
   - [IGDB API key](https://api.igdb.com/)
1. Copy `services/server/.env.example` to `services/server/.env` and fill in your keys

## Local

1. Run `yarn compose:local up`
1. Visit [localhost:8080](http://localhost:8080)

## Production

1. Start Traefik using their [quickstart config](https://docs.traefik.io/#the-traefik-quickstart-using-docker)
1. Create a `.env` file with `DOMAIN=[SUB.YOUR_DOMAIN]`
1. Run `yarn compose:prod up`
1. Visit [SUB.YOUR_DOMAIN]

# Usage

1. Enter your own SteamID, community URL, or vanity name
1. Enter your friends' as well
1. Filter the games you can play together

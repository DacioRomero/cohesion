// controller/app.js
const express = require('express');
const Promise = require('bluebird');
const intersection = require('array-intersection');
const IGDBAPI = require('igdb-api-node').default;
const SteamAPI = require('../utils/steamapi');

const router = express.Router();
const steam = SteamAPI();
const igbd = IGDBAPI();

router.get('/', (req, res) => {
    if (!req.query.steamids) {
        return res.json({
            error: 'You need to provide SteamIDs'
        })
    }

    const steamids = req.query.steamids.split(',')
    Promise.map(steamids, steamid => steam.getOwnedGames(steamid))
        .then(playerGames => {
            const appids = playerGames.map(list => list.games.map(game => game.appid))
            const sharedGames = intersection(...appids)

            return igbd.games({
                fields: '*',
                filters: {
                    'external_games.uid-=': `(${sharedGames.join(',')})`
                }
            });
        })
        .then(details => {
            res.json(details.body);
        })
        .catch(error => {
            res.status(400).json(error);
            console.error(error.message)
        })
});

module.exports = router;

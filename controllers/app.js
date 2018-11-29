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
        return res.status(400).json({
            error: 'You need to provide SteamIDs'
        })
    }

    const steamids = req.query.steamids.split(',')
    Promise.map(steamids, steamid => steam.getOwnedGames(steamid))
        .then(playerGames => {
            const sharedGames = intersection(...playerGames)

            let batches = []
            for (let i = 0; i < sharedGames.length; i += 50) {
                batches.push(sharedGames.slice(i, i + 50));
            }

            return Promise.map(batches, batch => {
                return igbd.games({
                    fields: '*',
                    filters: {
                        'external_games.uid-=': `(${batch.join(',')})`
                    },
                    limit: 50
                })
            });
        })
        .then(detailsBatches => {
            res.status(200).json(detailsBatches.map(batch => batch.body).flat());
        })
        .catch(error => {
            res.status(400).json(error.message);
            console.error(error.message)
        })
});

module.exports = router;

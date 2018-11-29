// controller/app.js
const express = require('express');
const Promise = require('bluebird');
const intersection = require('array-intersection');
const apicalypse = require('@igdb/apicalypse').default;
const SteamAPI = require('../utils/steamapi');

const router = express.Router();
const steam = SteamAPI();
const igbd = apicalypse({
    baseURL: "https://endpoint-alpha.igdb.com",
    headers: {
        'Accept': 'application/json',
        'user-key': process.env.IGDB_API_KEY
    },
    responseType: 'json'
});

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

            return Promise.map(batches, batch => 
                igbd
                .fields([
                    'name',
                    'cover.url',
                ])
                .limit(50)
                .filter([
                    'external_games.category = 1',
                    `external_games.uid = (${batch.join(',')})`,
                    'game_modes.id = 2'
                ])
                .request('/games')
                .catch(error => {
                    throw error.response.data;
                })
            );
        })
        .then(detailsBatches => {
            res.status(200).json(detailsBatches.map(batch => batch.data).flat());
        })
        .catch(error => {
            res.status(400).json(error);
        })
});

module.exports = router;

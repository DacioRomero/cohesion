// controller/app.js
const express = require('express');
const Promise = require('bluebird');
const intersection = require('array-intersection');
const apicalypse = require('@igdb/apicalypse').default;
const SteamAPI = require('../utils/steamapi');

const router = express.Router();
const steam = SteamAPI();
const igdb = apicalypse({
    baseURL: "https://endpoint-alpha.igdb.com",
    headers: {
        'Accept': 'application/json',
        'user-key': process.env.IGDB_API_KEY
    },
    responseType: 'json'
});

router.get('/:host', (req, res) => {
    const host = req.params.host;
    const friends = req.query.friends;

    const steamIds = [host];

    if (friends != null) {
        steamIds.push(...friends);
    }

    Promise.map(steamIds, steamid => steam.getOwnedGames(steamid))
        .then(userGames => {
            const sharedGames = intersection(...userGames);

            let batches = []
            for (let i = 0; i < sharedGames.length; i += 50) {
                batches.push(sharedGames.slice(i, i + 50));
            }

            return Promise.map(batches, batch => {
                const urls = batch.map(id => `https://store.steampowered.com/app/${id}`);

                const query = igdb
                    .fields([
                        'name',
                        'cover.image_id',
                    ])
                    .limit(50)
                    .filter([
                        'game_modes.slug = "multiplayer"',
                        `websites.url = ("${urls.join('","')}")`,
                        'game_modes.id = 2'
                    ]);

                return query.request('/games');
            });
        })
        .then(detailsBatches => {
            const games = detailsBatches.map(batch => batch.data).flat()

            return res.render('app', {
                host,
                friends,
                games
            });
        })
        .catch(error => {
            return res.status(400).json(error);
        })
})

module.exports = router;

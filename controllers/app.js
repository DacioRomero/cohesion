// controller/app.js
const express = require('express');
const Promise = require('bluebird');
const intersection = require('array-intersection');
const IGBDAPI = require('igdb-api-node').default;
const SteamAPI = require('../utils/steamapi');

const router = express.Router();
const steam = SteamAPI();
const igbd = IGBDAPI();

router.get('/', (req, res) => {
    if (!req.query.steamids) {
        return res.json({
            error: 'You need to provide SteamIDs'
        })
    }
    
    const steamids = req.query.steamids.split(',')
    Promise.map(steamids, id => steam.getOwnedGames(id))
        .then(gameLists => {
            const appidLists = gameLists.map(list => list.games.map(game => game.appid))
            const sharedGames = intersection(...appidLists)

            return Promise.map(sharedGames, id => igbd.games({
                fields: '*',
                filters: {
                    'websites.url-eq': `https://store.steampowered.com/app/${id}`,
                    'game_modes-eq': 2
                }
            }))
        })
        .then(details => {
            res.json(details.map(detail => detail.body[0]).filter(x => x != null));
        })
        .catch(error => {
            res.status(400).json({error: error.message});
            console.error(error.message)
        })
});

module.exports = router;

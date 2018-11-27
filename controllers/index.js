// controllers/index.js
const express = require('express');
const router = express.Router();
const steam = require('../utils/steam')

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/games/:appId', (req, res) => {
    steam.getAppDetails(req.params.appId, req.query.filters)
    .then(details => {
        res.status(200).json(details);
    })
    .catch(error => {
        res.status(400).json({error});
        console.error(error.message)
    })
});

router.get('/players/:steamid/games', (req, res) => {
    steam.getOwnedGames(process.env.STEAM_API, req.params.steamid)
    .then(games => {
        res.status(200).json(games);
    })
    .catch(error => {
        res.status(400).json({error})
        console.error(error.message);
    })
});


module.exports = router;

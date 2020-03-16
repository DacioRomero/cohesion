const express = require('express')
const asyncHandler = require('express-async-handler')

const keyBy = require('lodash/keyBy')
const zipObject = require('lodash/zipObject')

const igdb = require('../utils/igdb')
const cache = require('../utils/redis')

const router = express.Router()

const extrResData = res => res.data
const keyArrById = arr => keyBy(arr, 'id')

router.get(
  '/',
  asyncHandler(async (req, res) => {
    let glossaries = JSON.parse(await cache.getAsync('/glossaries'))

    if (!glossaries) {
      glossaries = zipObject(
        ['themes', 'genres', 'player_perspectives', 'platforms', 'game_modes'],
        await Promise.all([
          igdb
            .fields('name')
            .request('/themes')
            .then(extrResData)
            .then(keyArrById),
          igdb
            .fields('name')
            .request('/genres')
            .then(extrResData)
            .then(keyArrById),
          igdb
            .fields('name')
            .request('/player_perspectives')
            .then(extrResData)
            .then(keyArrById),
          igdb
            .fields('name')
            .where('id=(3,6,14)')
            .request('/platforms')
            .then(extrResData)
            .then(keyArrById),
          igdb
            .fields('name')
            .request('/game_modes')
            .then(extrResData)
            .then(keyArrById)
        ])
      )
      await cache.setAsync('/glossaries', JSON.stringify(glossaries))
    }

    res.json(glossaries)
  })
)

module.exports = router

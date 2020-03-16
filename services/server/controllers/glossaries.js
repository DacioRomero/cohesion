const Router = require('@koa/router')
const { keyBy, zipObject } = require('lodash')

const igdb = require('../utils/igdb')
const cache = require('../utils/redis')

const router = new Router()

const extrResData = res => res.data
const keyArrById = arr => keyBy(arr, 'id')

router.get('/', async ctx => {
  let glossaries = await cache.get('/glossaries').then(JSON.parse)

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
    await cache.set('/glossaries', JSON.stringify(glossaries))
  }

  ctx.body = glossaries
})

module.exports = router

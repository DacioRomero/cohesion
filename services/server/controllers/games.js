const Router = require('@koa/router')
const { zipObject, isEmpty, mapValues } = require('lodash')

const cache = require('../utils/redis')
const igdb = require('../utils/igdb')
const { nullToFalse, falseToNull } = require('../utils/conversions')

const router = new Router()

const getGames = async ids => {
  const cachedGames = zipObject(
    ids,
    (await cache.mgetAsync(...ids.map(id => `/games/${id}`))).map(JSON.parse)
  )

  const missingGames = Object.entries(cachedGames)
    .filter(([, game]) => game === null)
    .map(([id]) => id)

  const defaults = missingGames.map(id => ({ [id]: null }))

  const igdbGames = await igdb
    .fields([
      'name',
      'cover.image_id',
      'external_games.category',
      'external_games.uid',
      'themes',
      'genres',
      'player_perspectives',
      'platforms',
      'game_modes'
    ])
    .limit(missingGames.length)
    .where([
      'external_games.category = 1',
      `external_games.uid=("${missingGames.join('","')}")`,
      'parent_game=null' // Ignore DLC
    ])
    .request('/games')
    .then(res =>
      res.data.map(game => {
        const { external_games: externalGames, ...newGame } = game
        const appid = externalGames.find(game => game.category === 1).uid

        return { [appid]: { appid, ...newGame } }
      })
    )

  const newGames = Object.assign({}, ...defaults, ...igdbGames)

  if (!isEmpty(newGames)) {
    await cache.msetAsync(
      ...Object.entries(newGames)
        .map(([id, game]) => [
          `/games/${id}`,
          JSON.stringify(nullToFalse(game))
        ])
        .flat()
    )
  }

  return { ...mapValues(cachedGames, falseToNull), ...newGames }
}

router.get('/', async ctx => {
  let { appIds: ids } = ctx.query

  if (typeof ids === 'string' || ids instanceof String) {
    ids = ids.split(',')
  }
  const games = await getGames(ids)

  ctx.body = games
})

module.exports = router

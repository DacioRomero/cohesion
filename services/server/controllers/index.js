const Router = require('@koa/router')

const playersRouter = require('./players')
const gamesRouter = require('./games')
const glossariesRouter = require('./glossaries')

const router = new Router()

// Gets player info and game libraries.
router.use('/players', playersRouter.routes(), playersRouter.allowedMethods())

// Gets game details
router.use('/games', gamesRouter.routes(), gamesRouter.allowedMethods())

// For mapping id results from /details to names
router.use(
  '/glossaries',
  glossariesRouter.routes(),
  glossariesRouter.allowedMethods()
)

module.exports = router

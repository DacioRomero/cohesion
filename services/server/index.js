const path = require('path')
const Koa = require('koa')
const json = require('koa-json')

const controllers = require('./controllers')

require('dotenv').config({
  path: path.join(__dirname, '.env')
})

const app = new Koa()

app.use(json())
app.use(controllers.routes(), controllers.allowedMethods())

if (require.main === module) {
  const port = Number(process.env.PORT || 3000)

  app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
  })
}

module.exports = app

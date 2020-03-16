const express = require('express')
const path = require('path')

require('dotenv').config({
  path: path.join(__dirname, '.env')
})

const app = express()

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(require('./controllers'))

if (require.main === module) {
  const port = process.env.PORT || 3000

  app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
  })
}

module.exports = app

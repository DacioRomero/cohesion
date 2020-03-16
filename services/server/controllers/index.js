// controller/app.js
const express = require('express')

const router = express.Router()

// Gets player info and game libraries.
router.use('/players', require('./players'))

// Gets game details
router.use('/games', require('./games'))

// For mapping id results from /details to names
router.use('/glossaries', require('./glossaries'))

module.exports = router

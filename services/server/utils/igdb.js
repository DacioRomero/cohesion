const apicalypse = require('apicalypse').default

module.exports = apicalypse({
  baseURL: 'https://api-v3.igdb.com',
  headers: {
    Accept: 'application/json',
    'user-key': process.env.IGDB_API_KEY
  },
  responseType: 'json'
})

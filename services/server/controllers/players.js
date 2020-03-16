const express = require('express')
const asyncHandler = require('express-async-handler')

const zipObject = require('lodash/zipObject')
const isEmpty = require('lodash/isEmpty')
const mapValues = require('lodash/mapValues')
const merge = require('lodash/merge')

const Steam = require('../utils/steam')
const cache = require('../utils/redis')
const { falseToNull, nullToFalse } = require('../utils/conversions')

const router = express.Router()

const getIds = async inputs => {
  const cachedIns = zipObject(
    inputs,
    (await cache.mgetAsync(...inputs.map(i => `/ids/${i}`))).map(JSON.parse)
  )

  const missingIns = Object.entries(cachedIns)
    .filter(([, id]) => id === null)
    .map(([input]) => input)

  const newIns = zipObject(
    missingIns,
    await Promise.all(missingIns.map(input => Steam.GetSteamId64(input)))
  )

  if (!isEmpty(newIns)) {
    await cache.msetAsync(
      ...Object.entries(newIns)
        .map(([input, id]) => [
          `/ids/${input}`,
          JSON.stringify(nullToFalse(id))
        ])
        .flat()
    )
  }

  return Object.values({ ...mapValues(cachedIns, falseToNull), ...newIns })
}

const getLibraries = async ids => {
  // Get cached values
  const cachedLibs = zipObject(
    ids,
    (await cache.mgetAsync(...ids.map(id => `/libraries/${id}`))).map(
      JSON.parse
    )
  )

  // Get from wrapper new for all missing
  const newLibs = Object.assign(
    {},
    ...(await Promise.all(
      Object.entries(cachedLibs)
        .filter(([, games]) => games === null)
        .map(async ([id]) => {
          const games = await Steam.GetOwnedGames(id)
          return { [id]: games }
        })
    ))
  )

  // Store missing values
  if (!isEmpty(newLibs)) {
    await cache.msetAsync(
      ...Object.entries(newLibs)
        .map(([id, games]) => [
          `/libraries/${id}`,
          JSON.stringify(nullToFalse(games))
        ])
        .flat()
    )
  }

  return { ...mapValues(cachedLibs, falseToNull), ...newLibs }
}

const getProfiles = async ids => {
  // Get cached values
  const cachedProfs = zipObject(
    ids,
    (await cache.mgetAsync(...ids.map(id => `/profiles/${id}`))).map(JSON.parse)
  )

  // Get from wrapper new for all missing
  const newProfs = await Steam.GetPlayerSummaries(
    ...Object.entries(cachedProfs)
      .filter(([, profile]) => profile === null)
      .map(([id]) => id)
  )

  // Store missing values
  if (!isEmpty(newProfs)) {
    await cache.msetAsync(
      ...Object.entries(newProfs)
        .map(([id, profile]) => [
          `/profiles/${id}`,
          JSON.stringify(nullToFalse(profile))
        ])
        .flat()
    )
  }

  return { ...mapValues(cachedProfs, falseToNull), ...newProfs }
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    let { steamIds: ids } = req.query

    if (typeof ids === 'string' || ids instanceof String) {
      ids = ids.split(',')
    }

    // Convert URLs, IDs, and vanity names
    ids = (await getIds(ids)).filter(Boolean)

    const [libraries, profiles] = await Promise.all([
      getLibraries(ids),
      getProfiles(ids)
    ])

    merge(
      profiles,
      mapValues(libraries, games => ({ games }))
    )

    res.json(profiles)
  })
)

module.exports = router

import axios from 'axios'
import qs from 'qs'

import chunk from 'lodash/chunk'

const paramsSerializer = params =>
  qs.stringify(params, { arrayFormat: 'comma' })

export async function getPlayers(...steamIds) {
  const res = await axios.get('/api/players', {
    params: { steamIds },
    paramsSerializer
  })

  return res.data
}

export async function getGames(...appIds) {
  const res = await Promise.all(
    chunk(appIds, 100).map(ids =>
      axios.get('/api/games', {
        params: { appIds: ids },
        paramsSerializer
      })
    )
  )

  return Object.assign({}, ...res.map(r => r.data))
}

export async function getGlossaries() {
  const res = await axios.get('/api/glossaries')

  return res.data
}

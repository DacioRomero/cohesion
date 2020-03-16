import chunk from 'lodash/chunk'

export async function getPlayers(...steamIds) {
  const res = await fetch(`/api/players?steamIds=${steamIds.join(',')}}`)

  return res.json()
}

export async function getGames(...appIds) {
  const gameBatch = await Promise.all(
    chunk(appIds, 100).map(async ids => {
      const res = await fetch(`/api/games?appIds=${ids.join(',')}`)

      return res.json()
    })
  )

  return Object.assign({}, ...gameBatch)
}

export async function getGlossaries() {
  const res = await fetch('/api/glossaries')

  return res.json()
}

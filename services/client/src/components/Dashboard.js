import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'

import { intersection, omit, pickBy, isEmpty } from 'lodash'

import ProfileList from './ProfileContainer'
import GameList from './GameList'
import Navigation from './Navbar'

import * as api from '../api'

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  margin: auto;
  display: grid;
  grid-template-columns: 3fr 5fr;
  grid-template-areas: 'p g';

  @media only screen and (max-width: 1200px) {
    display: block;
  }
`

class Dashboard extends Component {
  state = {
    players: {},
    glossaries: {},
    filters: {},
    games: []
  }

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
      state: PropTypes.shape({
        player: PropTypes.string
      })
    })
  }

  async componentDidMount() {
    let glossaries = JSON.parse(localStorage.getItem('glossaries'))
    const { location } = this.props

    if (location.state) {
      this.addPlayers(location.state.player)
    }

    if (!glossaries) {
      glossaries = await api.getGlossaries()
      localStorage.setItem('glossaries', JSON.stringify(glossaries))
    }

    const {
      location: { search }
    } = this.props

    // Default arrays to be empty
    const filterLists = Object.keys(glossaries).reduce(
      (prev, cat) => ({ ...prev, [cat]: [] }),
      {}
    )

    const players = []
    const searchParams = new URLSearchParams(search)

    for (const [key, value] of searchParams) {
      if (key === 'players[]') {
        players.push(value)
      } else if (key.endsWith('[]')) {
        const filterKey = key.substring(0, key.length - 2)
        let filterList = filterLists[filterKey]

        if (!filterList) {
          filterList = filterLists[filterKey] = []
        }

        filterList.push(value)
      }
    }

    // Generate filters from lists in query
    const filters = Object.entries(glossaries).reduce(
      (prev, [cat, gloss]) => ({
        ...prev,
        [cat]: Object.keys(gloss).reduce(
          (prevDef, id) => ({
            ...prevDef,
            [id]: filterLists[cat].includes(id)
          }),
          {}
        )
      }),
      {}
    )

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ glossaries, filters }, () => {
      if (players.length !== 0) {
        this.addPlayers(...players)
      }
    })
  }

  addPlayers = async (...ids) => {
    const newPlayers = await api.getPlayers(...ids)

    this.setState(
      state => ({ players: { ...state.players, ...newPlayers } }),
      () => {
        this.updateUrl()
        this.genGameList()
      }
    )
  }

  removePlayers = (...ids) => {
    this.setState(
      state => ({ players: omit(state.players, ids) }),
      () => {
        this.updateUrl()
        this.genGameList()
      }
    )
  }

  updateUrl = () => {
    let { players } = this.state
    const { history } = this.props

    players = Object.keys(players)
    const filters = pickBy(this.genFilterLists(), list => !isEmpty(list))

    const searchParams = new URLSearchParams()

    for (const player of players) {
      searchParams.append('players[]', player)
    }

    for (const [filterName, filterList] of Object.entries(filters)) {
      for (const filterValue of filterList) {
        searchParams.append(`${filterName}[]`, filterValue)
      }
    }

    history.push({
      search: searchParams.toString()
    })
  }

  toggleFilter = (category, id) => {
    this.setState(
      state => {
        const { filters } = state
        const { [category]: catFilters } = filters
        const { [id]: val } = catFilters

        return {
          filters: { ...filters, [category]: { ...catFilters, [id]: !val } }
        }
      },
      () => {
        this.updateUrl()
      }
    )
  }

  genFilterLists = () => {
    const { filters } = this.state

    return Object.entries(filters).reduce(
      (prev, [cat, catFilters]) => ({
        ...prev,
        [cat]: Object.keys(pickBy(catFilters, Boolean)).map(Number)
      }),
      {}
    )
  }

  // For use in button
  genGameList = () => {
    this.setState(state => {
      const games = intersection(
        ...Object.values(state.players).map(p => p.games)
      )
      return { games }
    })
  }

  render() {
    const { players, glossaries, games, filters } = this.state
    const { addPlayers, removePlayers, toggleFilter } = this

    return (
      <div>
        <Navigation />
        <Wrapper>
          <ProfileList
            {...{
              players,
              addPlayers,
              removePlayers,
              glossaries,
              filters,
              toggleFilter
            }}
          />
          <GameList
            {...{ games, glossaries, filterLists: this.genFilterLists() }}
          />
        </Wrapper>
      </div>
    )
  }
}

Dashboard.defaultProps = {
  location: {
    state: {
      player: ''
    }
  }
}

export default Dashboard

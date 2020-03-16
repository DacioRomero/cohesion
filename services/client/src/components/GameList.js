import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'

import { difference, omit, pick, pickBy } from 'lodash'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import Game from './Game'

import * as api from '../api'

const GameContainer = styled.div`
  padding-top: 101px;
  grid-area: g;
  overflow: auto;
  background-color: #121212;
`

class GameList extends Component {
  static propTypes = {
    filterLists: PropTypes.objectOf(PropTypes.array).isRequired,
    games: PropTypes.arrayOf(PropTypes.number).isRequired,
    glossaries: PropTypes.objectOf(PropTypes.object).isRequired
  }

  state = {
    games: {},
    loading: true
  }

  // TODO: Find alternative to setting state here
  async componentDidUpdate(prevProps) {
    /* eslint-disable react/no-did-update-set-state */
    const { games: oldGames } = prevProps
    const { games: curGames } = this.props
    // this.setState({ loading: true });

    if (oldGames !== curGames) {
      // this.setState({ loading: true });
      const added = difference(curGames, oldGames)
      const removed = difference(oldGames, curGames)

      if (removed.length) {
        this.setState(state => ({ games: omit(state.games, removed) }))
      }

      if (added.length) {
        const defaults = Object.assign(...added.map(g => ({ [g]: false })))

        this.setState(state => ({
          loading: true,
          games: { ...state.games, ...defaults }
        }))

        const games = await api.getGames(...added)

        this.setState(state => ({
          loading: false,
          games: { ...state.games, ...pick(games, Object.keys(state.games)) }
        }))
      }

      if (!added.length && removed.length) {
        this.setState({ loading: true })
        setTimeout(() => {
          this.setState({ loading: false })
        }, 600)
      }
    }
  }

  renderGames = () => {
    let { games } = this.state
    const { filterLists, glossaries } = this.props

    games = pickBy(games, game => {
      if (game) {
        return Object.entries(filterLists).every(([cat, catFilters]) => {
          if (catFilters.length) {
            const { [cat]: ids } = game

            if (ids) {
              return difference(catFilters, ids).length === 0
            }
          }

          return true
        })
      }

      return false
    })

    return Object.values(games).map(game => (
      <Game key={game.appid} glossary={glossaries} {...game} />
    ))
  }

  render() {
    const { loading } = this.state
    if (loading) {
      // setTimeout(() => { this.setState({ loading: false }); }, 600);
      return (
        <GameContainer
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FontAwesomeIcon spin icon={faSpinner} style={{ fontSize: '30px' }} />
        </GameContainer>
      )
    }
    return <GameContainer>{this.renderGames()}</GameContainer>
  }
}

export default GameList

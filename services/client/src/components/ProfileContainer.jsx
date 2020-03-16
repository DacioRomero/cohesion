import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Field, Input } from 'bloomer'
import styled from 'styled-components'
import { Button } from 'bloomer/lib/elements/Button'

import { handleInputChange } from '@dacio/react-helpers'

import ProfileCard from './ProfileCard'
import Filters from './Filters'

const ProfileContainer = styled.div`
  padding-top: 100px;
  grid-area: p;
  overflow: auto;
  background-color: #121212;
  border-right: 1px solid rgb(52, 53, 54);
`
const padding = {
  textAlign: 'center',
  marginRight: '10px'
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

class ProfileList extends Component {
  state = { player: '' }

  static propTypes = {
    addPlayers: PropTypes.func.isRequired,
    filters: PropTypes.objectOf(PropTypes.object).isRequired,
    glossaries: PropTypes.objectOf(PropTypes.object).isRequired,
    // TODO: Add specificity to player objects
    players: PropTypes.objectOf(PropTypes.object).isRequired,
    removePlayers: PropTypes.func.isRequired,
    toggleFilter: PropTypes.func.isRequired
  }

  handleChange = handleInputChange.bind(this)

  handleEnterKey = event => {
    const { addPlayers } = this.props
    const { player } = this.state
    const { keyCode } = event

    if (keyCode === 13) {
      event.preventDefault()

      addPlayers(player)
      this.setState({ player: '' })
    }
  }

  handleSubmitButton = () => {
    const { player } = this.state
    const { addPlayers } = this.props
    addPlayers(player)
    this.setState({ player: '' })
  }

  renderPlayers = () => {
    const { players, removePlayers } = this.props

    return Object.entries(players).map(([id, player]) => (
      <ProfileCard
        key={id}
        alias={player.personaname}
        avatar={player.avatarmedium}
        games={player.games ? player.games.length : 0}
        lastonline={player.lastlogoff}
        name={player.realname}
        onClickDelete={() => removePlayers(id)}
      />
    ))
  }

  render() {
    const { player } = this.state
    const { glossaries, filters, toggleFilter } = this.props

    return (
      <ProfileContainer>
        {this.renderPlayers()}
        <InputContainer>
          <Field isGrouped>
            <Input
              name='player'
              placeholder='Enter a Steam ID'
              style={padding}
              type='text'
              value={player}
              onChange={this.handleChange}
              onKeyDown={this.handleEnterKey}
            />
            <Button onClick={this.handleSubmitButton}>submit</Button>
          </Field>
        </InputContainer>
        <Filters {...{ glossaries, filters, toggleFilter }} />
      </ProfileContainer>
    )
  }
}

export default ProfileList

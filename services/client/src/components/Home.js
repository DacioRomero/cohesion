import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { handleInputChange } from '@dacio/react-helpers'

import { Hero, HeroBody, Container, Title } from 'bloomer'

import '../App.css'

const size = {
  backgroundColor: '#232323'
}

const TitleFontSize = {
  color: 'white',
  fontSize: 'calc(7vw + 50px)',
  marginTop: '-60px',
  marginBottom: '-10px',
  fontWeight: 'bold'
}

// Remember to follow naming conventions!!
const SubFontSize = {
  fontSize: 'calc(6px + 2vw)',
  min: '30px',
  marginTop: '0px',
  marginBottom: '30px',
  color: 'white',
  fontWeight: '300'
}

class Home extends Component {
  state = {
    player: '',
    enter: false
  }

  handleChange = handleInputChange.bind(this)

  handleEnterKey = event => {
    const { keyCode } = event
    if (keyCode === 13) {
      event.preventDefault()
      this.setState({ enter: true })
    }
  }

  render() {
    const { player, enter } = this.state
    if (enter) {
      return (
        <Redirect
          to={{
            pathname: '/dashboard',
            state: { player }
          }}
        />
      )
    }
    return (
      <Hero className='Hero' isColor='fullheight' style={size}>
        <HeroBody>
          <Container hasTextAlign='centered'>
            <Title className='Title' style={TitleFontSize}>
              COHESION
            </Title>
            <Title style={SubFontSize}>
              <span
                aria-label='emoji-celebration'
                role='img'
                style={{ marginRight: '30px' }}
              >
                🎮
              </span>
              compare your Steam games with friends
              <span
                aria-label='emoji-celebration'
                role='img'
                style={{ marginLeft: '30px' }}
              >
                🎮
              </span>
            </Title>
            <input
              autoComplete='off'
              className='homeinput'
              name='player'
              placeholder='Enter a Steam ID'
              style={{
                width: '40vw',
                height: '40px',
                border: 'none',
                textAlign: 'center',
                borderRadius: '30px',
                marginBottom: '20px'
              }}
              type='text'
              value={player}
              onChange={this.handleChange}
              onFocus={e => {
                e.target.placeholder = ''
              }}
              onKeyDown={this.handleEnterKey}
            />
            <Link
              className='link'
              style={{
                display: 'block',
                width: '20%',
                margin: 'auto',
                fontSize: 'calc(6px + 1vw)'
              }}
              to={{
                pathname: '/dashboard',
                state: { player }
              }}
            >
              get started
            </Link>
          </Container>
        </HeroBody>
      </Hero>
    )
  }
}

export default Home

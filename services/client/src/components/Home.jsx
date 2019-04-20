/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { handleInputChange } from '@dacio/react-helpers';


import {
  Hero, HeroBody, Container, Title,
} from 'bloomer';

import '../App.css';

const size = {
  backgroundColor: '#232323',
};

const TitleFontSize = {
  color: 'white',
  fontSize: 'calc(7vw + 50px)',
  marginTop: '-60px',
  marginBottom: '-10px',
  fontWeight: 'bold',
};

// Remember to follow naming conventions!!
const SubFontSize = {
  fontSize: 'calc(6px + 2vw)',
  min: '30px',
  marginTop: '0px',
  marginBottom: '30px',
  color: 'white',
  fontWeight: '300',
};


class Home extends Component {
  state = { player: '' };

  handleChange = handleInputChange.bind(this);

  render() {
    const { player } = this.state;

    return (
      <Hero className="Hero" isColor="fullheight" style={size}>
        <HeroBody>
          <Container hasTextAlign="centered">
            <Title className="Title" style={TitleFontSize}>COHESION</Title>
            <Title style={SubFontSize}>
              <span
                role="img"
                aria-label="emoji-celebration"
                style={{ marginRight: '30px' }}
              >
              🎮
              </span>
            compare your Steam games with friends
              <span
                role="img"
                aria-label="emoji-celebration"
                style={{ marginLeft: '30px' }}
              >
              🎮
              </span>
            </Title>
            <input
              type="text"
              className="homeinput"
              placeholder="Enter a Steam ID"
              name="player"
              value={player}
              onChange={this.handleChange}
              autoComplete="off"
              style={{
                width: '40vw', height: '40px', border: 'none', textAlign: 'center', borderRadius: '30px', marginBottom: '20px',
              }}
            />
            <Link
              className="link"
              style={{
                display: 'block', width: '20%', margin: 'auto', fontSize: 'calc(6px + 2vw)',
              }}
              to={{
                pathname: '/dashboard',
                state: { player },
              }}
            >
              get started
            </Link>
          </Container>
        </HeroBody>
      </Hero>
    );
  }
}

export default Home;

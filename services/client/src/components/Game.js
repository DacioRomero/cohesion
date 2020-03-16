import React from 'react'
import PropTypes from 'prop-types'
import '../index.css'

import { Media, MediaLeft, Content, MediaContent } from 'bloomer/esm'

const game = {
  border: '1px solid rgb(52, 53, 54)',
  borderRadius: '4px',
  // paddingBottom: '10px',
  paddingTop: '0px',
  margin: 'auto',
  marginBottom: '18px',
  // paddingLeft: '20px',
  width: '85%',
  backgroundColor: 'rgb(36,36,36)',
  color: 'white'
}

const img = {
  objectFit: 'cover',
  objectPosition: '0 0',
  maxWidth: '100%',
  maxHeight: '100%',
  width: '130px',
  height: '130px',
  backgroundPosition: 'bottom',
  borderTopLeftRadius: '3px',
  borderBottomLeftRadius: '3px'
}

const Game = props => {
  /* eslint-disable camelcase */
  const { themes, glossary, cover, name, game_modes, genres } = props
  const theme =
    themes &&
    themes.map(
      themeid => glossary.themes[themeid] && glossary.themes[themeid].name
    )
  const genre =
    genres &&
    genres.map(
      genreid => glossary.genres[genreid] && glossary.genres[genreid].name
    )

  return (
    <Media className='Media' style={game}>
      <MediaLeft
        style={{
          marginBottom: '-6px',
          backgroundPosition: 'top',
          height: 'inherit'
        }}
      >
        <img
          alt='game cover'
          src={
            cover.image_id
              ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${cover.image_id}.png`
              : `https://dummyimage.com/500x500/000000/ffffff&text=${name}`
          }
          style={img}
        />
      </MediaLeft>
      <MediaContent style={{ padding: '12px' }}>
        <Content>
          <p className='p'>
            <strong className='gamename' style={{ fontSize: '20px' }}>
              {name}
            </strong>
            <br />
            {/* {game_modes.length && glossary.gamse_modes[game_modes[0]].name} */}
            <i>
              {game_modes
                .map(mode => glossary.game_modes[mode].name)
                .join(', ')}
            </i>
            <br />
            <strong>Genres: </strong>
            {genre
              .map(_genres => _genres)
              .filter(_genre => _genre)
              .join(', ')}
            <br />
            <strong>Themes: </strong>
            {theme
              .map(_themes => _themes)
              .filter(_theme => _theme)
              .join(', ')}
          </p>
        </Content>
      </MediaContent>
    </Media>
  )
}

Game.defaultProps = {
  themes: [],
  glossary: {},
  cover: {},
  name: {},
  game_modes: [],
  genres: []
}

Game.propTypes = {
  cover: PropTypes.object,
  game_modes: PropTypes.arrayOf(PropTypes.number),
  genres: PropTypes.arrayOf(PropTypes.number),
  glossary: PropTypes.objectOf(PropTypes.object),
  name: PropTypes.string,
  themes: PropTypes.arrayOf(PropTypes.number)
}

export default Game

import React from 'react'
import PropTypes from 'prop-types'

import {
  Card,
  CardContent,
  Media,
  MediaLeft,
  Image,
  Title,
  MediaContent,
  Content,
  Subtitle,
  Delete
} from 'bloomer'
import Moment from 'react-moment'

import '../App.css'

const size = {
  paddingLeft: 'calc(10px + 2vw)',
  paddingRight: 'calc(10px + 2vw)',
  width: '400px',
  height: 'max-content',
  margin: 'auto',
  marginBottom: '15px',
  borderRadius: '4px',
  position: 'relative',
  color: 'white',
  backgroundColor: 'rgb(36,36,36)',
  border: '1px solid rgb(52, 53, 54)'
}

const content = {
  marginBottom: '0px'
}

const padding = {
  paddingLeft: '15px'
}

const absolute = {
  position: 'absolute',
  top: '10px',
  right: '10px'
}

const ProfileCard = props => {
  const { avatar, name, alias, games, lastonline, onClickDelete } = props

  return (
    <Card className='Card' style={size}>
      <CardContent>
        <Media style={padding}>
          <MediaLeft>
            <Image isSize='48x48' src={avatar} />
          </MediaLeft>
          <MediaContent>
            <Title isSize={4} style={{ color: 'white' }}>
              {name}
            </Title>
            <Subtitle isSize={6} style={{ color: 'white' }}>
              {`@${alias}`}
            </Subtitle>
          </MediaContent>
        </Media>
        <Content style={content}>
          <strong>Total Games: </strong>
          {games}
          <br />
          <strong>Last Online: </strong>
          <Moment fromNow unix>
            {lastonline}
          </Moment>
        </Content>
        <Delete style={absolute} onClick={onClickDelete} />
      </CardContent>
    </Card>
  )
}

ProfileCard.propTypes = {
  alias: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  games: PropTypes.number.isRequired,
  lastonline: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  onClickDelete: PropTypes.func.isRequired
}

export default ProfileCard

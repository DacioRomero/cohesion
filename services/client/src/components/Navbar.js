import React, { Component } from 'react'

import copyToClipboard from 'copy-to-clipboard'

import { Navbar, NavbarEnd, Button } from 'bloomer/esm'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'

const styles = {
  color: 'white',
  position: 'fixed',
  width: '100vw',
  height: '55px',
  backgroundColor: 'rgb(36,36,36)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgb(52, 53, 54)'
}

const marginLeft = {
  marginLeft: '20px'
}

const marginRight = {
  marginRight: '20px',
  transition: 'width 2s'
}

class Navigation extends Component {
  state = {
    copied: false
  }

  handleClickCopy = () => {
    copyToClipboard(window.location.href)

    this.setState({ copied: true })

    setTimeout(() => {
      this.setState({ copied: false })
    }, 2000)
  }

  render() {
    const { copied } = this.state

    return (
      <Navbar style={styles}>
        <Link className='cohesion' style={marginLeft} to='/'>
          COHESION
        </Link>
        <NavbarEnd>
          <Button
            disabled={copied}
            style={marginRight}
            type='button'
            onClick={this.handleClickCopy}
          >
            {copied ? 'Copied' : <FontAwesomeIcon icon={faClipboard} />}
          </Button>
        </NavbarEnd>
      </Navbar>
    )
  }
}

export default Navigation

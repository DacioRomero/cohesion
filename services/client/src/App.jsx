import React from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import './App.css'
import 'normalize.css'
import 'bulma/css/bulma.css'

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Route exact component={Home} path='/' />
        <Route component={Dashboard} path='/dashboard' />
      </div>
    </Router>
  )
}

export default App

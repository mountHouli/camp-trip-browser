import React from 'react'
import { Route, Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import Home from './Home'
import Trip from './Trip'

class App extends React.Component {
  render () {
    return (
      <div>
        <div>This is the app page, and here are some links:</div>
        <div><Link to={'/trip/1'}>Trip 1</Link></div>
        <Route path='/' exact component={Home} />
        <Route path='/trip' component={Trip} />
      </div>
    )
  }
}

App.propTypes = {
  route: PropTypes.any // !! fix this once I figure out what kind of prop this is
}

export default App

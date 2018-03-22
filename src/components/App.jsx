import React from 'react'
import { Route, Redirect, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader'

// import Home from './Home' // !! fix this
import TripList from './TripList'
import Trip from './Trip'

class App extends React.Component {
  render () {
    return (
      <div>
        <div>This is the app page, and here are some links:</div>
        <div><Link to={'/trip/1'}>Trip 1</Link></div>
        <Route path='/' exact component={TripList} />
        <Route path='/trip' component={Trip} />
        <Route exact path='/nothing' render={() => (<Redirect to='/trip/1'/>)}/>
      </div>
    )
  }
}

App.propTypes = {
  route: PropTypes.any // !! fix this once I figure out what kind of prop this is
}

// I have no idea where this "module" word comes from, what it does, or how it works.
// It looks like a syntax error to me.
// It is as written in examples from react-hot-loader README.md
// and I tested it and it's necessary for HMR to work.
export default hot(module)(App)

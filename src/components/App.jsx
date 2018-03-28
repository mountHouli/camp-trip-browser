import React from 'react'
import { Route, Redirect, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader'

import Home from './Home' // !! fix this
import Trip from './Trip'
import Header from './Header'

// Just need to import global.css once somewhere so its styles get processed by webpack.
// eslint-disable-next-line no-unused-vars
import globalStyles from '../styles/global.css'
import { header_height, bg_green, width_100 } from '../styles/common.css'
// import { side_bars } from '../styles/App.css'

class App extends React.Component {
  render () {
    return (
      <div>
        <Header/>
        <div className={[header_height, bg_green].join(' ')}>
          This is behind the header
        </div> {/* Do this more cleanly !! */}
        <div>
          <div>a</div>
          <div>
          <Link to={'/trip/1'}>Trip 1</Link>
          <Route path='/' exact component={Home} />
          <Route path='/trip' component={Trip} />
          <Route exact path='/nothing' render={() => (<Redirect to='/trip/1'/>)}/>
          </div>
          <div>b</div>
        </div>
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

import React from 'react'
import PropTypes from 'prop-types'

class Trip extends React.Component {
  // ?? do I need to create a constructor and/or call super ??
  constructor (props) {
    super(props)
  }
  // !! remove console.log once i figure this out
  render () {
    console.log('Trip component: render(): this.props.route')
    console.log(this.props.route)
    return (
      <div>
        <div>This is the trip page</div>
      </div>
    )
  }
}

Trip.propTypes = {
  route: PropTypes.any // !! fix this once I figure out what kind of prop this is
}

export default Trip

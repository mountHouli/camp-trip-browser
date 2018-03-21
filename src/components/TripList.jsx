import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import TripListItem from './TripListItem'

class TripList extends React.Component {
  render () {
    const trips = this.props.trips.data
    const tripNameComponents = Object.keys(trips).map(key => TripListItem(key, null, trips[key].name))
    return (
      <div>{tripNameComponents}</div>
    )
  }
}

TripList.propTypes = {
  trips: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  trips: state.trips
})

export default connect(mapStateToProps)(TripList)

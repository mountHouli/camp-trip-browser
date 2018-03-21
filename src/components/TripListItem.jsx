import React from 'react'
import PropTypes from 'prop-types'

const TripListItem = (key, onClick, tripName) => {
  return (
    <div key={key}>
      <div>{tripName}</div>
      <button onClick={onClick}>View</button>
    </div>
  )
}

TripListItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  tripName: PropTypes.string.isRequired
}

export default TripListItem

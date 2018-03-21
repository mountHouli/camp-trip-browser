import { combineReducers } from 'redux'

import {
  GET_TRIPS_REQUEST,
  GET_TRIPS_SUCCESS,
  GET_TRIPS_FAILURE
} from './actions'

function trips (state = {}, action) {
  switch (action.type) {
    case GET_TRIPS_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case GET_TRIPS_FAILURE:
      return {
        ...state,
        isFetching: false
      }
    case GET_TRIPS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isInvalidated: false,
        data: action.trips.reduce((accumulator, currentTrip) => {
          accumulator[currentTrip._id] = currentTrip
          return accumulator
        }, {})
      }
    default:
      return state
  }
}

function errors (state = [], action) {
  switch (action.type) {
    case GET_TRIPS_FAILURE:
      return [
        ...state,
        {
          type: action.errorType,
          errorMessage: action.error.message
        }
      ]
    default:
      return state
  }
}

const rootReducer = combineReducers({
  trips,
  errors
})

export default rootReducer

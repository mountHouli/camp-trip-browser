import { get } from '../fetcher/fetcher.js'

import { GET_TRIPS_ERROR } from './errorTypes'

export const GET_TRIPS_REQUEST = 'GET_TRIPS_REQUEST'
function getTripsRequest () {
  return {
    type: GET_TRIPS_REQUEST
  }
}

export const GET_TRIPS_SUCCESS = 'GET_TRIPS_SUCCESS'
function getTripsSuccess (trips) {
  return {
    type: GET_TRIPS_SUCCESS,
    trips
  }
}

export const GET_TRIPS_FAILURE = 'GET_TRIPS_FAILURE'
function getTripsFailure (error) {
  return {
    type: GET_TRIPS_FAILURE,
    errorType: GET_TRIPS_ERROR,
    error: error
  }
}

export function fetchTrips () {
  return async (dispatch) => {
    dispatch(getTripsRequest)

    const response = await get('/trips')

    if (response.error) {
      dispatch(getTripsFailure(response.error))
    }
    else {
      dispatch(getTripsSuccess(response.data))
    }
  }
}

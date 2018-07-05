import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

import { fetchTrips } from './actions'
import rootReducer from './reducers'

// We must not directly export the store as a module, because if we do it becomes a singleton,
// which would cause it to get created once when the server starts and all requests
// (therefore ALL USERS!) will share it, which is a no-can-do because of SSR.
export default async (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunkMiddleware
    )
  )

  // !! Do this differently (fetch stuff based on the requested URL path; don't just arbitrarily fetch trips)
  await store.dispatch(fetchTrips()) // !! this could error out, so catch it

  return store
}

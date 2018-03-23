import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from './components/App'
import createStore from './state/store.js'

// I don't like this async function here.  Do it a better way. !!
// eslint-disable-next-line indent
;(async () => {
  const store = await createStore()

  ReactDOM.hydrate(
    <Provider store={store}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Provider>,
    document.getElementById('react_root')
  )
})()

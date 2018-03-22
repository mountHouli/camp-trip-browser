// NOTE:  Hot reloading does not work on anything above the <App /> component.
// See README for details.
import React from 'react'
import { StaticRouter } from 'react-router'
import { Provider } from 'react-redux'

import App from './components/App'

const Html = (url, store, context) => {
  return (
    <html leng='en'>
      <head>
        <meta charSet='utf-8' />
      </head>
      <body>
      <div id='react_root'>
        <Provider store={store}>
          <StaticRouter location={url} context={context}>
            <App />
          </StaticRouter>
        </Provider>
      </div>
      <script src="/clientIndex.bundle.js"></script>
      </body>
    </html>
  )
}

export default Html

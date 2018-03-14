import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router'

import App from './components/App'

export default (location, context) => {
  const reactHtml = ReactDOMServer.renderToString(
    <StaticRouter location={location} context={context}>
      <App />
    </StaticRouter>
  )
  return reactHtml
}

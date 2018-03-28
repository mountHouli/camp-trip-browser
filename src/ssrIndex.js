// Note:  The entire SSR HTML generation must be handled by the middleware defined in this file
// because webpack-dev-server-middleware must be able to app.use this whole thing so it can
// completely handle and respond to requests made to the dev server.
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router'

import App from './components/App.jsx'
import createStore from './state/store.js'

export default function ssrIndexMiddlewareCreator () {
  return async (req, res) => {
    const context = {}

    const store = await createStore()

    const reactHtml = ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <App/>
        </StaticRouter>
      </Provider>
    )

    const indexHtml = ssrIndexHtmlGenerator(reactHtml)

    // The when react renders, StaticRouter (in Html.jsx) will modify the context object.
    // If the requested location is a react router redirect, the router will add a
    // url member to context that is the location to redirect to
    if (context.url) {
      res.redirect(301, context.url)
    }
    else {
      res.header('Content-Type', 'text/html; charset=UTF-8')
      res.send(indexHtml)
    }
  }
}

// !! fix <script src="/whatever" /> relative path to handle both http and https (if it doesn't already--I dont know)
function ssrIndexHtmlGenerator (reactRootContent) {
  // !! Do this a cleaner way, not using NODE_ENV in this function !!
  // Also, the ternary operator, when evauating to false, puts a blank line in the html, which isn't bad at all but isn't perfectly clean either. !!
  const { NODE_ENV } = process.env

  const html =
`<head>
  <link rel="stylesheet" href="https://unpkg.com/basscss@8.0.2/css/basscss.min.css"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:500,700"/>
  ${NODE_ENV === 'prod' ? '<link href="/clientIndex.bundle.css" rel="stylesheet"/>' : ''}
</head>
<body>
  <div id="react_root">${reactRootContent}</div>
  <script src="/clientIndex.bundle.js"></script>
</body>`

  return html
}

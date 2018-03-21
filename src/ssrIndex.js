// Note:  Non-react HTML template string generation and any SSR code that has to be webpack compiled (e.g. react components)
// must both be handled by the middleware defined in this file because webpack-dev-server-middleware must be able
// to app.use this whole thing so it can completely handle and respond to requests made to the dev server.
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { Provider } from 'react-redux'

import App from './components/App'
import ssrIndexHtmlGenerator from './ssrIndexHtmlGenerator'
import createStore from './state/store.js'

// Why am I returning an express middleware rather than just directly  exporting it ??
export default () => {
  return async (req, res) => {
    const context = {}

    const store = await createStore()

    const reactHtml = ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </Provider>
    )

    const indexHtml = ssrIndexHtmlGenerator(reactHtml)

    // The when react renders, StaticRouter (in reactHtmlGenerator.js) will modify the context object.
    // If the requested location is a react router redirect, the router will add a
    // url member to context that is the location to redirect to
    if (context.url) {
      res.status(301).append({ Location: context.url }).send()
    }
    else {
      res.header('Content-Type', 'text/html; charset=UTF-8')
      res.send(indexHtml)
    }
  }
}

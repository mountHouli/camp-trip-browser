// Note:  The entire SSR HTML generation must be handled by the middleware defined in this file
// because webpack-dev-server-middleware must be able to app.use this whole thing so it can
// completely handle and respond to requests made to the dev server.
import ReactDOMServer from 'react-dom/server'

import Html from './html.jsx'
import createStore from './state/store.js'

export default function ssrIndexMiddlewareCreator () {
  return async (req, res) => {
    const context = {}

    const store = await createStore()

    const indexHtml = ReactDOMServer.renderToString(
      Html(req.url, store, context)
    )

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

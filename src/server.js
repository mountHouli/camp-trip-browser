// NOTE:
// When NODE_ENV=prod, this file will be running in the dist/ dir, and all paths are relative from there
// When NODE_ENV=src,  this file will be running in the src/ dir, and all paths are relative from there
// The same paths work in both places because the path relativity is the same whether in src/ or dist/
const path = require('path')

const express = require('express')

// !! This file needs this to be require()ed here; but the rest of the app might need to import it !!
const conf = require('./config')

const app = express()

if (process.env.NODE_ENV === 'dev') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpackHotServerMiddleware = require('webpack-hot-server-middleware')

  const webpackConfig = require('../webpack.config.js')
  const clientWebpackConfig = webpackConfig.find(config => config.name === 'client')

  const compiler = webpack(webpackConfig)
  const clientBundleCompiler = compiler.compilers.find(compiler => compiler.name === 'client')

  app.use(webpackDevMiddleware(compiler, {
    publicPath: clientWebpackConfig.output.publicPath,
    // serverSideRender: true
    // I dont think I need serverSideRender: true !!
    // if index is not explicitly set to false, webpack-dev-middleware will respond to requests for the root dir with public/index.html, which we don't want, because we want the ssrMiddlware instead to read this index file, put the react into it, and send the whole string to the client.
    // Setting index: false makes webpack-dev-middleware ignore requests to the root, which allows the request to make it to app.use(ssrMiddleware())
    // !! i dont need this
    // index: false
  }))
  app.use(webpackHotMiddleware(clientBundleCompiler))
  // ?? do I need to app.use(express.static) here ??
  // This does what app.use(ssrIndexMiddleware()) does in production.
  app.use(webpackHotServerMiddleware(compiler, { chunkName: 'ssrIndex' }))
}
else if (process.env.NODE_ENV === 'prod') {
  const ssrIndexMiddleware = require('./ssrIndex.bundle.js').default()

  app.use(express.static(path.resolve(__dirname, 'public')))

  app.use(ssrIndexMiddleware)
}
else {
  throw new Error('You must specify NODE_ENV = either "prod" or "dev".  Script exiting...')
}

app.listen(conf.port, (err) => {
  if (err) {
    // !! Handle this better in production
    console.error('Error starting server:')
    console.error(err)
    process.exit(1)
  }
})

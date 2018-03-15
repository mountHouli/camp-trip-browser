// !! require() paths are relative to where things sit in the dist directory
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

  const webpackConfig = require('../webpack.config.js') // !! fix relative path

  const compiler = webpack(webpackConfig)

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.find(compiler => compiler.name === 'client').output.publicPath,
    serverSideRender: true
  }))
  app.use(webpackHotMiddleware(compiler.compilers.find(compiler => compiler.name === 'client')))
  // ?? do I need to app.use(express.static) here ??
  // This does what app.use(ssrMiddleware()) does in production.
  app.use(webpackHotServerMiddleware(compiler))
}
else if (process.env.NODE_ENV = 'prod') {
  const ssrMiddleware = require('./ssrBundle.js').default // !! make sure this path is what you want

  app.use(express.static(path.resolve(__dirname, 'public'))) // !! fix this path for dev !!

  app.use(ssrMiddleware())
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

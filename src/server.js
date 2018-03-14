// !! require() paths are relative to where things sit in the dist directory
const path = require('path')

const express = require('express')

const conf = require('./config') // !! This file needs this to be require()ed; but the rest of the app might need to import it !!
const ssrBundle = require('./ssrBundle').default
const ssrIndexHtmlGenerator = require('./ssrIndexHtmlGenerator')

const app = express()

app.use(express.static(path.resolve(__dirname, 'public'))) // !! fix this path for dev !!

app.get('*', (req, res) => {
  const context = {}

  const reactHtml = ssrBundle(req.url, context)
  const indexHtml = ssrIndexHtmlGenerator(reactHtml)

  // The when react renders, StaticRouter (in reactHtmlGenerator.js) will modify the context object.
  // If the requested location is a react router redirect, it will add a
  // url member to context that is the location to redirect to
  if (context.url) {
    res.status(301).append({ Location: context.url }).send()
  }
  else {
    res.header('Content-Type', 'text/html; charset=UTF-8')
    res.send(indexHtml)
  }
})

app.listen(conf.port, (err) => {
  if (err) {
    // !! Handle this better in production
    console.error('Error starting server:')
    console.error(err)
    process.exit(1)
  }
})

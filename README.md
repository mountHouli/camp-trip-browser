# camp-trip-client

For booking trips.

## Miscellaneous Notes

Used node v9.8.0 while developing.

npm script "lint" explicity specifies exit status 0 because eslint produces exit status 1 when it finds lint errors and the npm script runner detects this and reports that the command had an error.

Here is why I'm using Redux and not MobX
- I prefer things that make it easier to reason about state (Redux has one state store, not multiple)
- I prefer good tools and maintainabililty (immutable state, great debug tools)
- I don't care that my app might be pretty simple.  The extra boilerplate of redux doesn't bother me.  I rather keep things maintainable.
See:
- https://codeburst.io/mobx-vs-redux-with-react-a-noobs-comparison-and-questions-382ba340be09
- https://www.robinwieruch.de/redux-mobx-confusion/

## To-Do

- Front end locks up with "TypeError: Cannot read property 'reduce' of undefined" if the api is non-responsive
- Build system
  - CSS, setup global file that has its classes not mangled by css-loader's localIdentName.
  - Consider just building the SSR code with babel instead of webpack 
    - Was suggested here https://medium.com/@mattvagni/server-side-rendering-with-css-modules-6b02f1238eb1
    - babel-plugin-css-modules-transform
  - Code splitting
    - react-loadable
      - ????????????? if I output all the bundles into the html, they will all load at pageload anyway, so this doesn't reduce the amount of data I have to load at page load time, so what's the point ????????????
      - maybe `npm uninstall -save react-loadbale`
  - Errors hidden until dev server killed.  Ex:  `ReferenceError: WHATEVER_COMPONENT_I_USED_BUT_FORGOT_TO_IMPORT is not defined`
  - Production build makes a request to `/__webpack_hmr`
  - Setup dev envr
    - Clean up env var setting, especially NODE_ENV
      - switch NODE_ENV from "prod" and "dev" to "production" and "development" because this is what webpack uses.
      - maybe use webpack "mode" option
      - https://webpack.js.org/configuration/configuration-types/
    - debug
      - `output.devtoolModuleFilenameTemplate: '[absolute-resource-path]'`
      - add a entry.context: param so that webpack isn't dependent on cwd
  - Minify
  - Could use code splitting to make `clientIndex.bundle.js` and `ssrIndex.bundle.js` share most of the same code.  Not necessar, however, because code splitting is usually for performance reasons.
  - Quit using HtmlWebpackPlugin because
    - It has a bug so it doesn't delete junk/index.html
    - I'd rather have a separate npm script to clean that I can run whenever I want, without also building.
- Consider using `import { syncHistoryWithStore } from 'react-router-redux';`
- Performance
  - use renderToNodeStream() from react-dom/server instead of renderToString() (see https://blogs.msmvps.com/theproblemsolver/2017/11/26/react-server-side-rendering-with-webpack/)
- Fix `<script src="/whatever" />` relative path to handle both http and https (if it doesn't already--I dont know)

### Low Priority

- Build system
  - eslint
    - `.eslintrc.json` React recommended settings (see https://github.com/yannickcr/eslint-plugin-react)
  - Enable dist/ dir cleaning without webpack building.
  - move common webpack config (such as copying and cleaning files) from server to client config.

### Done

- In server.js, require() paths are relative to where things sit in the dist directory, so make them work for env=dev as well
- Build system
  - eslint
    - make it run on files in the root dir
    - no-console rule (make it warn, or maybe remove it altogether)
  - Setup dev envr
    - Hot reloading
    - Setup SSR for prod env
    - delete client/server/shared folder structure
    - Make webpack config support both prod and dev
  - npm uninstall webpack-dev-server
  - make dist/ dir cleaning maintainable (not requiring explicity specify every file in it)

## Environment and Build System Works Like This...

Note:  `code` below is pseudocode

### Production Server Request Handling

- When a request comes in, `app.use(ssrMiddleware)` -- which comes from src/ssrIndex.js AKA dist/ssrIndex.bundle.js) -- renders the react for the requested page (react-router chooses what to render based on the URL path passed to it's Location prop) and plugs it into html generated from a template, which it then returns to the client.
- When that html reaches the browser, it has element `<script src="/public/clientIndex.bundle.js"></script>` which makes the browser grab dist/public/clientIndex.bundle.js (which is generated by webpack.config.js; also which dist/server.js's express.static() is configured to return), which--upon getting to the browser--runs and calls ReactDOM.hydrate to hydrate the existing HTML that was originally put there by ssrIndex.bundle.js

### Dev Server Request Handling

Due to SSR with react-router, two different bundles are needed--one is the bundle used for server side rendering that has <StaticRouter/> in it, and the other is the bundle that gets sent to the browser that has <BrowserRouter/> in it.

The key to setting up a dev environment with hot reloading for both of these bundles is `webpack-hot-server-middleware`.  This package is designed to be used this way:

```
const webpackConfig = require('./webpack.config.js')
const webpack = require('webpack')
const webpackHotServerMiddleware = require('webpack-hot-server-middleware')
// webpack-hot-server-middleware sees in webpack.config.js the config
// for the server bundle (the one with `name: 'server'`)
// and expects the bundle output of this config to be an express middleware
// (e.g. (req, res) => {} function) which will handle all
// the requests, render all of the html
//   (both from the html template string and the react rendered content in its
//   react root div (and again, in the ssr middleware function, it is
//   react-router's <StaticRouter/> the picks what react html to render
//   based on the URL that was requested))
// and then res.send(theCompleteHtmlForThePage) back to the client
app.use(webpackHotServerMiddleware(webpack(webpackConfig)))
```
- Since this package is designed to act as middleware.  `app.use(webpack-hot-server-middleware)` REPLACES the way things work in production, which, again, is `app.use(require(ssrIndex.bundle.js).expressMiddlewareFunctionThatRendersAllTheHtmlAndSendsItToTheClient`

### Hot Reloading Setup

Adding webpack-dev-middleware and webpack-hot-middleware only set up the server to connect/listen/send HMR updates to the browser.  You have to use react-hot-loader (via babel) to make react get and apply the updates.

#### webpack-hot-middleware config:

```
// webpack.config.js (this is pseudocode, just to give you an idea)
module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    'myAppOrWhatever.js'
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}

```

### SSR With Webpack

#### Originally...

Originally, this project had a simple webpack config, with simple output (just one bundle, not multiple assets), so I could manually generate (using a JS template string) the index HTML, and just insert the react generated markup into it.  As follows:

```
// Server-side code handled / returned by express middleware I setup to do SSR...

const App = () => {
  return (
    <div>This is the top level div of App
      <div>This is more stuff</div>
    </div>
  )
}

const htmlTemplateGenerator = (reactHtml) => {
  const html = 
    `<head>
    </head>
    <body>
      <div id="react_app_root">${reactHtml}</div>
      <script src="/public/path/to/clientIndex.bundle.js"></script>
    </body>
    `
}

const reactHtml = ReactDOMServer.renderToString(
  <Provider store={store}>
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  </Provider>
)

res.send(htmlTemplateGenerator(reactHtml))

// And clientIndex.js (which turns into clientIndex.bundle.js) had this...
ReactDOM.hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('react_root')
)
```

Above, `ReactDOMServer.renderToString()` sees that `<App/>` is the root component and inserts `data-reactroot` here:

```
// ... stuff ...
<body>
  <div id="react_app_root" data-reactroot="">
    <div>This is the top level div of App
      <div>This is more stuff</div>
// ... stuff ...
```

which lines up perfectly with `clientIndex.bundle.js`'s call to `ReactDOM.hydrate()`.

#### The problem...

This project is going to start having a more complicated webpack output--specifically, it will have multiple webpack bundles / assets, with various auto-generated names.

`html-webpack-plugin` nicely handles putting the urls to all these auto-generated assets into an index.html file.  Since I'm doing SSR, I can't do that.  Therefore, I have to manually generate the HTML.  Since the HTML is going to be very complicated, I'm going to use React to generate it, rather than just a normal javascript template string as above.  This could be a problem for hot reloading in the future because...

(Note:  I have it working now, but the entire reason I'm making this note is in case there are problems later)

`react-hot-loader`, when using the following version of its API (which is easier to use and is recommended)...

```
import { hot } from 'react-hot-loader'
const App = () => (<div>'Hello World!'</div>)
export default hot(module)(App)
```

...needs the "hot exported" component (`<App/>` in this case), to be the top level component.  However, the way I have set things up now...

```
// Html.jsx
import App from './components/App'

const Html = (url, context, store, ) => {
  // Just to be clear, this is all JSX, not HTML.
  return (
    <html>
      <head>
      </head>
      <body>
        <Provider store={store}>
          <StaticRouter location={url} context={context}>
            <App />
          </StaticRouter>
        </Provider>
        <!-- Ignore the fact that the script and its src are static here.  It's beside the point.  I know I need to fix it -->
        <script src="./clientIndex.bundle.js">
      </body>
    </html>
  )
}

// In the express middleware that handles all requests and does SSR...
res.send(ReactDOMServer.renderToString(Html(req.url, theContext, theStore)))

// Note: clientIndex.bundle.js remains the same as it is above--treating <App/> as the react root.
```

... `ReactDOMServer.renderToString()` outputs `data-reactroot` in the `<html>` tag (rather than in the top-level `<div/>` of `<App/>`) like this...

```
<html data-reactroot="">
  <head>
// ... the rest of the stuff ...
```

This is how I do things now, and again, this note is just in case it causes problems in the future.

Note:  Like this, hot reloading in the browser only works an `<App/>` and its children, of course (not on `<Html/>`).  I haven't checked hot reloading of the ssrIndex.bundle.js, but it's almost certainly the same case.

### Code Splitting

I want to do code splitting.  To manage this MUCH easier, I need to use HtmlWebpackPlugin (so that every time I change a code split, I don't have to manually change my index.html file, and it will also almost certainly handle injecting the bundle hash part of the name into the index.html file, which, if I was doing manually, would have to be done EVERY TIME I BUILD).

However, I'm doing SSR, and in SSR, an express middleware handles EVERYTHING (generating the non-ract html from a simple string template, and putting the react html into it, and sending it to the browser).

So, how do I use HtmlWebpackPlugin WITH ssr??

The specific problem is, the express middleware that generates ALL the html, without HtmlWebpackPlugin, can operate on a (non-react) html generating function in my src/ directory, but with HtmlWebpackPlugin, I need it to be able to grab the generated-by-webpack index.html (with all of the scripts and stuff webpack has injected into it), and insert into that file (or the string content of that file), the react html, which I can then send off to the client.

### CSS With SSR (re: style-loader and extract-text-webpack-plugin)

#### Background (how `style-loader` and `css-loader` normally work):

`css-loader` runs first, then `style-loader`.  `css-loader` converts the css in `.css` module files into their CSS-Module-localIdentName / webpackified class names, and puts everything in whatever.bundle.js file is specified by your webpack config (for example, your normal entry file).

Then, `style-loader`, RUNS IN THE BROWSER and goes through your whatever.bundle.js and finds all the css that was put there by `css-loader`, and applies it to your page.

#### But with SSR...

`style-loader` chokes on server-side rendering.  I have found only one way around this that is clean, and it is very specific.

Specifically, `style-loader` must not be used with SSR.  Instead `extract-text-webpack-plugin` must be used for the SSR bundle.  We might as well use `extract-text-webpack-plugin` for the browser bundle, too.

Note:  `css-loader`'s `options.localIdentName` must be the same for both client and ssr/server bundle, otherwise react will complain the `.hydrate()`ed markup doesn't match what it got from the server--and also your CSS won't work (I'm pretty darn sure).

The problem is, `extract-text-webpack-plugin` breaks hot reloading.

Therefore, the necessary config is:
In prod, client bundle:  Use `extract-text-webpack-plugin`, because you might as well have all CSS in the same place, plus it will probably load faster.
In prod, server bundle:  Use `extract-text-webpack-plugin`, because you have to, because `style-loader` chokes on SSR.
In dev,  client bundle:  Use `style-loader`,                so that you can have HMR.
In dev,  server bundle:  Use `extract-text-webpack-plugin`, because you have to, because `style-loader` chokes on SSR.

Note:  In this prod config, we will end up with both `clientIndex.bundle.css` and `ssrIndex.bundle.css`.  We only need one of these.  Since both the client entry point and the server entry point, as it pertains to where CSS is included, have the same dependency graph/tree, we could use either of those bundles.  Thought, `clientIndex.bundle.css` makes more sense to use because the browser requests it, and it is automtically put in the `dist/public/` dir.  Consequently, `ssrIndex.bundle.css` goes unused, which is fine.

#### One more layer:

I want to use `basscss.com`-style classes, and I want to manually extend those classes into a global stylesheet I create (`src/styles/global.scss`).  This stylesheet needs to NOT have its class names `CSS-Modules`-like mangled by `extract-text-webpack-plugin` options `{ modules: true, localIdentName: '[hash_or_whatever][and_stuff]' }`.  However, it still must pass through loaders because...
1. It needs to get processed by `sass-loader` and `postcss-loader`
2. HMR for the global style sheet needs to work while `NODE_ENV = development`.
That is why it is excluded from the normal `/\.css$/` loader chains of the various configs (client/server, prod/dev), and has its own loader chain.

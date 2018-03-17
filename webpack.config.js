const path = require('path')

const webpack = require('webpack')
const webpackNodeExternals = require('webpack-node-externals')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { removeEmpty } = require('webpack-config-utils')

const { NODE_ENV } = process.env

const deploymentLevelSpecificConfigs = {
  clientConfig: {
    entry: {
      prod: path.join(__dirname, 'src', 'clientIndex.js'),
      dev: [
        // We only want to use this for the client bundle, because HMR for the server bundle
        // is handled not by webpack-hot-middleware but by webpack-hot-server-middleware
        'webpack-hot-middleware/client',
        path.join(__dirname, 'src', 'clientIndex.js')
      ]
    },
    devtool: {
      prod: undefined,
      // 'cheap-module-eval-source-map' is the fastest type of source map that still
      // almost perfectly preserves the original source files and line numbers.
      dev: 'cheap-module-eval-source-map'
    },
    plugins: {
      prod: undefined,
      dev: [
        // We only want to use this for the client bundle, because HMR for the server bundle
        // is handled not by webpack-hot-middleware but by webpack-hot-server-middleware
        new webpack.HotModuleReplacementPlugin()
      ]
    }
  },
  serverConfig: {
    devtool: {
      prod: undefined,
      // 'cheap-module-eval-source-map' is the fastest type of source map that still
      // almost perfectly preserves the original source files and line numbers.
      dev: 'cheap-module-eval-source-map'
    }
  }
}

const { clientConfig, serverConfig } = deploymentLevelSpecificConfigs

// In order to work with webpack-hot-server-middleware, module.exports must =
// array with two members
//  - one with name: 'client' for the bundle that gets sent to the browser
//  - one with name: 'server' for webpack-hot-server-middleware to use for SSR
module.exports = [
  removeEmpty({
    name: 'client',
    target: 'web',
    entry: clientConfig.entry[NODE_ENV],
    output: {
      filename: 'clientBundle.js',
      path: path.join(__dirname, 'dist', 'public'),
      publicPath: '/'
    },
    devtool: clientConfig.devtool[NODE_ENV],
    module: {
      rules: [
        {
          test: /\.js(?:x?)$/, // match .js files and .jsx files
          include: [/src/], // !! verify this works like I think it does !! ¿¿ Why is it a regex ??
          loader: 'babel-loader'
        }
      ]
    },
    resolve: {
      // Make the webpack resolver look for .jsx files (in addition to defaults),
      // so you can import a .jsx file without specifying the extension
      extensions: ['.js', '.json', '.jsx']
    },
    plugins: clientConfig.plugins[NODE_ENV]
  }),
  removeEmpty({
    name: 'server',
    // Causes webpack to use normal "require()" rather than the webpack require.
    // We want this because this file is for code that will always run on the server.
    target: 'node',
    // Causes webpack to not add to the bundle any packages in node_modules such as express.
    // We want this because this file is for server side code, so we don't need to bundle these things.
    externals: [webpackNodeExternals()],
    entry: path.join(__dirname, 'src', 'ssrIndex.js'),
    output: {
      filename: 'ssrBundle.js',
      path: path.join(__dirname, 'dist'),
      // This makes it so ssrIndex.js's default export, which is a function, can be required and used.
      // Note:  When using the "commonjs2" option, the webpack "output.library:" member is irrelevant.
      libraryTarget: 'commonjs2'
    },
    devtool: serverConfig.devtool[NODE_ENV],
    module: {
      rules: [
        {
          test: /\.js(?:x?)$/, // match .js files and .jsx files
          include: [/src/], // !! verify this works like I think it does !! ¿¿ Why was it originally the regex [/src/] ??
          exclude: ['src/server.js', 'src/ssrIndex.js'], // !! fix this
          loader: 'babel-loader'
        }
      ]
    },
    resolve: {
      // Make the webpack resolver look for .jsx files (in addition to defaults),
      // so you can import a .jsx file without specifying the extension
      extensions: ['.js', '.json', '.jsx']
    },
    plugins: [
      new CleanWebpackPlugin(
        [
          'dist/*.*',
          'dist/public/*.*'
        ],
        {
          root: __dirname,
          exclude: '.gitkeep',
          verbose: true
          // set watch: true ??
        }
      ),
      new CopyWebpackPlugin([
        // The "to:" paths are relative to the "output.path:" directory
        {from: 'src/server.js', to: './server.js'},
        {from: 'src/ssrIndexHtmlGenerator.js', to: './ssrIndexHtmlGenerator.js'},
        {from: 'src/config.js', to: './config.js'}
      ])
    ]
  })
]

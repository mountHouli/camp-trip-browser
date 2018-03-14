const path = require('path')

const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, 'src', 'ssrIndex.js'),
  output: {
    filename: 'ssrBundle.js',
    path: path.join(__dirname, 'dist'),
    // This makes it so ssrIndex.js's default export, which is a function, can be required and used.
    // Note:  When using the "commonjs2" option, a webpack "library:" member is irrelevant.
    libraryTarget: "commonjs2"
  },
  // !! remove in production
  // 'cheap-module-eval-source-map' is the fastest type of source map that still
  // almost perfectly preserves the original source files and line numbers.
  devtool: 'cheap-module-eval-source-map',
  // !! remove
  // devServer: {
  //   contentBase: './dist',
  //   port: 3000
  // },
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
    new CopyWebpackPlugin([
      {from: 'src/server.js', to: 'server.js'},
      {from: 'src/ssrIndexHtmlGenerator.js', to: 'ssrIndexHtmlGenerator.js'},
      {from: 'src/config.js', to: 'config.js'}
    ])
  ],
  // Causes webpack to use normal "require()" rather than the webpack require.
  // We want this because this file is for code that will always run on the server.
  target: 'node',
  // Causes webpack to not add to the bundle any packages in node_modules such as express.
  // We want this because this file is for server side code, so we don't need to bundle these things.
  externals: [nodeExternals()]
}

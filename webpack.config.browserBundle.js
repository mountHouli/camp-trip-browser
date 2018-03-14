const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'src', 'browserIndex.js'),
  output: {
    filename: 'browserBundle.js',
    path: path.join(__dirname, 'dist', 'public')
  },
  // !! remove in production
  // 'cheap-module-eval-source-map' is the fastest type of source map that still
  // almost perfectly preserves the original source files and line numbers.
  devtool: 'cheap-module-eval-source-map',
  // !! remove this
  // devServer: {
  //   contentBase: './dist',
  //   port: 3000
  // },
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
  }
}

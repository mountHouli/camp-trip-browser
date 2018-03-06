const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  // 'cheap-module-eval-source-map' is the fastest type of source map that still
  // almost perfectly preserves the original source files and line numbers.
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: './dist',
    port: 3000
  },
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
  plugins: [
    // !! I don't fully understand this.  What I do know is...
    // - webpack-dev-server doesn't output files but instead just creates them in memory, so of course I never see it create files in the /dist dir
    // - If I don't specify template: 'src/index.html', when I start webpack-dev-server, the page doesn't work
    // - I think this is automatically using a loader (because I think it has to use a loader), which I would assume would be html loader,  but I don't have html-loader npm installed, so I don't know how it works.
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
}

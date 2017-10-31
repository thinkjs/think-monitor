var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var base = __dirname;
var entryDir = path.join(base, '/fesrc');
module.exports = {
  entry: {
    monitor: entryDir + '/monitor',
    install: entryDir + '/install'
  },
  output: {
    path: path.join(base, '/www/static'),
    // publicPath: path.join(base, '/www/static'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?sourceMap!postcss-loader'
      },
      {
        test: /\.sass/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.scss/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.less/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.styl/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|ttf|eot|svg|woff|woff2)$/,
        loader: 'url-loader?name=[path][name].[ext]&limit=200000'
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'install.html',
      template: './view/install_index.html',
      inject: 'body',
      minify: {
        removeComments: true
      },
      chunks: ['install']
    }),
    new HtmlWebpackPlugin({
      filename: 'monitor.html',
      template: './view/monitor_index.html',
      inject: 'body',
      minify: {
        removeComments: true
      },
      chunks: ['monitor']
    })
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(base, '/www/static'),
    noInfo: true,
    overlay: true,
    openPage: "monitor.html",
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
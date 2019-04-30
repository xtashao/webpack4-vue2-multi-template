'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const dirConfig = require('./dir.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const HTMLWebpackPlugin = require('html-webpack-plugin')

const HTMLPlugins = []
const Entries = {}

dirConfig.HTMLDirs.forEach(item => {
  let filename = utils.resolve(`dist/${item.page}.html`)
  if (item.dir) filename = utils.resolve(`dist/${item.dir}/${item.page}.html`)
  const htmlPlugin = new HTMLWebpackPlugin({
    title: item.title,
    filename: filename, // 生成到dist目录下的html文件名称，支持多级目录（eg: `${item.page}/index.html`）
    template: path.resolve(__dirname, `../src/template/index.html`), // 模板文件，不同入口可以根据需要设置不同模板
    favicon: utils.resolve('favicon.ico'),
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    },
    chunksSortMode: 'dependency',
    chunks: [item.page, 'vendor'] // html文件中需要要引入的js模块，这里的 vendor 是webpack默认配置下抽离的公共模块的名称
  })
  HTMLPlugins.push(htmlPlugin)
  Entries[item.page] = path.resolve(__dirname, `../src/pages/${item.page}/index.js`) // 根据配置设置入口js文件
})

const PUBLIC_PATH = process.env.NODE_ENV === 'production'
  ? config.build.assetsPublicPath
  : config.dev.assetsPublicPath

console.log(HTMLPlugins)
console.log(Entries)

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: Entries,
  output: {
    path: config.dev.assetsRoot,
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['*', '.css', '.js', '.vue', '.json'],
    alias: {
      '@': utils.resolve('src'),
      '@components': utils.resolve('src/components'),
      '@styles': utils.resolve('src/styles'),
      '@assets': utils.resolve('src/assets'),
      '@vuex': utils.resolve('src/store')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          utils.resolve('src'),
          utils.resolve('test'),
          utils.resolve('node_modules/webpack-dev-server/client')
        ]
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [utils.resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [utils.resolve('src/icons')],
        options: {
          // outputPath: dirConfig.imgOutputPath,
          limit: 10000,
          name: utils.assetsPath('images/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          publicPath: PUBLIC_PATH,
          // outputPath: dirConfig.imgOutputPath,
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          publicPath: PUBLIC_PATH,
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([{
      from: utils.resolve('src/static/images'),
      to: utils.resolve('dist/static/images'),
      toType: 'dir'
    }, {
      from: utils.resolve('src/static/fonts'),
      to: utils.resolve('dist/static/fonts'),
      toType: 'dir'
    }]),
    ...HTMLPlugins

    // new CopyWebpackPlugin([{
    //     from: path.resolve(__dirname, '../public'),
    //     to: path.resolve(__dirname, '../dist'),
    //     ignore: ['*.html']
    //   },
    //   {
    //     from: path.resolve(__dirname, '../src/scripts/lib'),
    //     to: path.resolve(__dirname, '../dist')
    //   }
    // ]),
  ],
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}

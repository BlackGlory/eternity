const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const { ProvidePlugin } = require('webpack')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  target: 'web'
, entry: {
    'background': './src/background.ts'
  , 'options': './src/options/index.tsx'
  }
, output: {
    path: path.join(__dirname, 'dist')
  , filename: '[name].js'
  }
, resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  , plugins: [new TsconfigPathsPlugin()]
  , fallback: {
      'util': require.resolve('util/')
    , 'path': require.resolve('path-browserify')
    }
  }
, module: {
    rules: [
      {
        test: /\.tsx?$/
      , exclude: /node_module/
      , use: 'ts-loader'
      }
    , {
        test: /\.css$/i
      , use: ['style-loader', 'css-loader']
      }
    , {
        test: /\.js$/
      , exclude: /node_module/
      , use: 'raw-loader'
      }
    , {
        test: /\.ttf$/
      , use: ['file-loader']
      }
    ]
  }
, plugins: [
    new ProvidePlugin({
      process: 'process'
    })
  , new MonacoWebpackPlugin({
      languages: ['javascript']
    })
  , new CopyPlugin({
      patterns: [
        { from: './src', globOptions: { ignore: ['*.ts', '*.tsx', '*.html'] }}
      , { from: './src/options/index.html', to: 'options.html' }
      , { from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js' }
      , { from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js.map' }
      ]
    })
  ]
}

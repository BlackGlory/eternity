const { merge } = require('webpack-merge')
const common = require('./webpack.common.cjs')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
  mode: 'production'
, optimization: {
    minimize: true
  , minimizer: [
      new TerserPlugin()
    ]
  }
, plugins: [
    new CopyPlugin({
      patterns: [
        { from: './src/manifest.prod.json', to: 'manifest.json' }
      ]
    })
  ]
})

const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  target: 'web'
, entry: {
    'background': './src/background/index.ts'
  , 'options': './src/options/index.tsx'
  , 'editor': './src/editor/index.tsx'
  }
, output: {
    path: path.join(__dirname, 'dist')
  , filename: '[name].js'
  }
, resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  , plugins: [new TsconfigPathsPlugin()]
  , fallback: {
      'path': require.resolve('path-browserify')
    }
  , extensionAlias: {
      '.js': ['.js', '.ts']
    , '.jsx': ['.jsx', '.tsx']
    , '.cjs': ['.cjs', '.cts']
    , '.mjs': ['.mjs', '.mts']
    }
  }
, module: {
    rules: [
      {
        test: /\.([cm]?ts|tsx)$/
      , loader: 'ts-loader'
      }
    , {
        test: /\.css$/i
      , use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    , {
        test: /\.ttf$/
      , type: 'asset/resource'
      }
    ]
  }
, plugins: [
    new MonacoWebpackPlugin()
  , new CopyPlugin({
      patterns: [
        {
          from: './src'
        , globOptions: {
            ignore: ['**/*.ts', '**/*.tsx', '**/*.html', '**/manifest.*.json']
          }
        }
      , { from: './src/options/index.html', to: 'options.html' }
      , { from: './src/editor/index.html', to: 'editor.html' }
      ]
    })
  ]
}

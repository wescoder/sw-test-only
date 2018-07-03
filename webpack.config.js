var devcert = require('devcert')
var path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

const PUBLIC_HOST = 'sw-test-only.lvh.me'
const PUBLIC_PORT = 8000
const PUBLIC_PATH = `https://${PUBLIC_HOST}:${PUBLIC_PORT}`

module.exports = async () => {
  const { cert, key } = await devcert.certificateFor(PUBLIC_HOST)
  return {
    entry: {
      main: path.resolve(__dirname, 'src/index')
    },
    output: {
      path: path.resolve(__dirname, 'dist/'),
      filename: '[name]-[hash].js',
      publicPath: '/'
    },
    devtool: 'inline-source-map',
    devServer: {
      https: {
        cert,
        key
      },
      disableHostCheck: true,
      port: PUBLIC_PORT,
      host: PUBLIC_HOST,
      contentBase: './dist',
      clientLogLevel: 'info',
      historyApiFallback: true,
      compress: true,
      noInfo: true
    },
    plugins: [
      new SWPrecacheWebpackPlugin(
        {
          cacheId: 'sw-test-only',
          dontCacheBustUrlsMatching: /\.\w{8}\./,
          filename: 'sw.js',
          minify: true,
          navigateFallback: PUBLIC_PATH,
          staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
          templateFilePath: path.resolve('./src/service-worker.js.ejs')
        }
      ),
      new HtmlWebpackPlugin({
        template: './src/index.html'
      })
    ]
  }
}

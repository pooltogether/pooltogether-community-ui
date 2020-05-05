const chalk = require("chalk")
const path = require('path')
const withImages = require('next-images')
const webpack = require('webpack')
const _ = require('lodash')

const isProduction = process.env.NODE_ENV === 'production'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  inlineImageLimit: 48, // make it tiny so that it doesn't inline,
}

const allConfig =
  withBundleAnalyzer(
  withImages(
    {
      ...nextConfig,
      webpack(config, options) {
        config.resolve.alias['assets'] = path.join(__dirname, 'assets')
        config.resolve.alias['lib'] = path.join(__dirname, 'lib')
        config.resolve.alias['artifacts'] = path.join(__dirname, 'artifacts')

        config.optimization.minimizer = []

        config.mode = isProduction ? 'production' : 'development'

        var appVars = _.keys(process.env).filter(key => key.startsWith('NEXT_JS_'))

        config.plugins.push(new webpack.EnvironmentPlugin(_.pick(process.env, appVars)))

        return config
      }
    }
  ))

console.log('')
console.log(chalk.green('Using next.js config options:'))
console.log(allConfig)
console.log('')

module.exports = allConfig

const {
  override,
  addWebpackResolve,
  disableEsLint,
  addBabelPlugin,
  addWebpackPlugin
} = require('customize-cra')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

module.exports = override(
  disableEsLint(),
  addWebpackResolve({
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat'
    }
  }),
  addBabelPlugin('lodash'),
  addWebpackPlugin(new LodashModuleReplacementPlugin())
)

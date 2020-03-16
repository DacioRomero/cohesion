const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = app => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.PROXY_URL,
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    })
  )
}

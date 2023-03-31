/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware');

const target = process.env.REACT_APP_TARGET || 'localhost';

// eslint-disable-next-line func-names
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://${  target  }:3070`,
      changeOrigin: true,
    })
  );
};
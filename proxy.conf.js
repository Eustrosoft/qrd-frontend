/**
 * https://angular.dev/tools/cli/serve#proxying-to-a-backend-server
 */

module.exports = [
  {
    context: ['^/qrCodeDemo(/|$)'], // ^ = start, (/|$) = / or end
    target: 'https://qrdemo.dev40.qxyz.ru/',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    pathRewrite: {
      '^/qrCodeDemo': '/qrCodeDemo', // Optional, keeps the path as-is
    },
  },
  {
    context: ['^/qr(/|$)'], // ^ = start, (/|$) = / or end
    target: 'https://qrdemo.dev40.qxyz.ru/',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    pathRewrite: {
      '^/qr': '/qr', // Optional, keeps the path as-is
    },
  },
  {
    context: ['^/printer(/|$)'], // ^ = start, (/|$) = / or end
    target: 'https://qrdemo.dev40.qxyz.ru/',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    pathRewrite: {
      '^/printer': '/printer', // Optional, keeps the path as-is
    },
  },
];

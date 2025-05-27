/**
 * https://angular.dev/tools/cli/serve#proxying-to-a-backend-server
 */

module.exports = [
  {
    changeOrigin: true,
    context: ['/qrCodeDemo'],
    secure: false,
    target: 'https://qrdemo.dev40.qxyz.ru/',
    logLevel: 'info',
  },
];

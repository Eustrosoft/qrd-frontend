/**
 * https://angular.dev/tools/cli/serve#proxying-to-a-backend-server
 */

module.exports = [
  {
    changeOrigin: true,
    context: ['/api'],
    secure: false,
    target: '',
    logLevel: 'info',
  },
];

const path = require('path');

module.exports = {
  name: 'statuz-rn',
  web: {
    bundler: 'webpack',
    webpackConfig: {
      resolve: {
        fallback: {
          "vm": path.resolve(__dirname, 'vm-mock.js'),
          "crypto": require.resolve("crypto-browserify"),
          "stream": require.resolve("stream-browserify"),
          "buffer": require.resolve("buffer/"),
        }
      }
    }
  }
}; 
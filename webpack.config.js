const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add crypto polyfill configuration
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
    vm: require.resolve('vm-browserify'),
    path: require.resolve('path-browserify'),
    os: require.resolve('os-browserify/browser'),
    fs: false,
    net: false,
    tls: false,
  };

  return config;
}; 
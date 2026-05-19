const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');

const root = path.resolve(__dirname, '..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const baseConfig = getDefaultConfig(__dirname);

// RN 0.85+ returns blockList as a RegExp; react-native-monorepo-config expects an array.
if (
  baseConfig.resolver?.blockList &&
  !Array.isArray(baseConfig.resolver.blockList)
) {
  baseConfig.resolver.blockList = [baseConfig.resolver.blockList];
}

const config = withMetroConfig(baseConfig, {
  root,
  dirname: __dirname,
});

module.exports = config;

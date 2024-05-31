// const { getSentryExpoConfig } = require("@sentry/react-native/metro");

// // This replaces `const config = getDefaultConfig(__dirname);`
// const config = getSentryExpoConfig(__dirname);

// module.exports = config;

const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push("cjs");

module.exports = defaultConfig;

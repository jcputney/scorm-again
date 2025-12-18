const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add zip to asset extensions (for bundled courses and scorm-again)
config.resolver.assetExts.push("zip");

module.exports = config;

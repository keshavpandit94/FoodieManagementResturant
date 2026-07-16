const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Fix: @expo/ui package.json exports point to missing TypeScript source files.
// Override the resolver to map these missing paths to the compiled JS fallbacks.
const originalResolveRequest = config.resolver?.resolveRequest;

config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    // Redirect missing @expo/ui src paths to existing compiled JS files
    if (moduleName === "@expo/ui/jetpack-compose") {
      return {
        filePath: path.resolve(
          __dirname,
          "node_modules/@expo/ui/jetpack-compose/index.js"
        ),
        type: "sourceFile",
      };
    }
    if (moduleName === "@expo/ui/jetpack-compose/modifiers") {
      return {
        filePath: path.resolve(
          __dirname,
          "node_modules/@expo/ui/jetpack-compose/modifiers.js"
        ),
        type: "sourceFile",
      };
    }
    if (moduleName === "@expo/ui/swift-ui") {
      return {
        filePath: path.resolve(
          __dirname,
          "node_modules/@expo/ui/swift-ui/index.js"
        ),
        type: "sourceFile",
      };
    }
    if (moduleName === "@expo/ui/swift-ui/modifiers") {
      return {
        filePath: path.resolve(
          __dirname,
          "node_modules/@expo/ui/swift-ui/modifiers.js"
        ),
        type: "sourceFile",
      };
    }
    // Fall through to default resolution
    if (originalResolveRequest) {
      return originalResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = withNativewind(config, { input: "./src/global.css" });

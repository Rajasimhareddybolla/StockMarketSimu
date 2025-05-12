import 'dotenv/config';

export default {
  name: "StockMarketApp",
  slug: "stockmarketapp",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#ffffff"
    }
  },
  web: {},
  plugins: [],
  extra: {
    geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    eas: {
      projectId: "your-project-id"
    }
  }
}; 
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
    
    eas: {
      projectId: "your-project-id"
    }
  }
}; 
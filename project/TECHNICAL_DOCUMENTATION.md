# Technical Documentation: StockMarketSimu

## 1. Introduction

This document provides a comprehensive technical overview of the StockMarketSimu application. StockMarketSimu is a mobile application built with React Native and Expo, designed to simulate stock market trading. Users can manage a virtual portfolio, track stock prices, buy and sell stocks, view their transaction history, and interact with a chat feature powered by the Google Gemini API.

## 2. Core Technologies

The application leverages a modern stack for mobile development:

*   **Framework:** Expo SDK 52.0.33
*   **Language:** TypeScript 5.3.3
*   **UI Library:** React Native 0.76.6
*   **Navigation:**
    *   `expo-router` (4.0.17): File-system based routing.
    *   `@react-navigation/bottom-tabs` (7.2.0): For tab-based navigation.
    *   `@react-navigation/native` (7.0.14): Core navigation utilities.
*   **State Management:** React Context API
*   **Local Storage:** `@react-native-async-storage/async-storage` (1.21.0)
*   **API Integration:**
    *   `@google/genai` (0.14.0) / `@google/generative-ai` (0.24.1): For interacting with the Google Gemini API (primarily for the chat feature).
*   **Styling:** React Native StyleSheet, with dynamic theming based on `useColorScheme`.
*   **Fonts:** `@expo-google-fonts/inter` (0.2.3)
*   **Icons:** `@expo/vector-icons` (14.0.2), `lucide-react-native` (0.475.0)
*   **Utilities:**
    *   `uuid` (11.1.0): For generating unique identifiers.
    *   `expo-constants` (17.0.5)
    *   `expo-font` (13.0.3)
    *   `expo-haptics` (14.0.1)
    *   `expo-linear-gradient` (14.0.2)
    *   `expo-linking` (7.0.5)
    *   `expo-camera` (16.0.18)
    *   `expo-blur` (14.0.3)
    *   `expo-splash-screen` (0.29.21)
    *   `expo-status-bar` (2.0.1)
    *   `expo-symbols` (0.2.2)
    *   `expo-system-ui` (4.0.7)
    *   `expo-web-browser` (14.0.2)
*   **Animation & Gesture Handling:**
    *   `react-native-gesture-handler` (2.23.0)
    *   `react-native-reanimated` (3.16.7)
*   **Other Dependencies:**
    *   `react-native-safe-area-context` (4.12.0)
    *   `react-native-screens` (4.4.0)
    *   `react-native-svg` (15.11.1)
    *   `react-native-url-polyfill` (2.0.0)
    *   `react-native-web` (0.19.13)
    *   `react-native-webview` (13.12.5)

## 3. Project Structure

The project is organized into the following main directories and files:

```
StockMarketSimu/project/
├── app.json                    # Expo app configuration
├── expo-env.d.ts               # TypeScript definitions for Expo environment variables
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript compiler configuration
├── TECHNICAL_DOCUMENTATION.md  # This document
├── .prettierrc                 # Prettier configuration for code formatting
├── app/                        # Routing and screen components (managed by expo-router)
│   ├── _layout.tsx             # Root layout for the app
│   ├── +not-found.tsx          # Fallback screen for unmatched routes
│   ├── index.tsx               # Entry point screen (likely redirects or initial view)
│   ├── login.tsx               # Login screen
│   ├── register.tsx            # Registration screen
│   ├── (tabs)/                 # Directory for screens within the tab navigator
│   │   ├── _layout.tsx         # Layout for the tab navigator
│   │   ├── chat.tsx            # Chat screen
│   │   ├── history.tsx         # Transaction history screen
│   │   ├── index.tsx           # Main dashboard/home screen within tabs
│   │   ├── markets.tsx         # Market overview screen
│   │   ├── portfolio.tsx       # User's portfolio screen
│   │   ├── profile.tsx         # User profile screen
│   │   └── search.tsx          # Stock search screen
│   └── stock/                  # Screens related to individual stocks
│       └── [symbol].tsx        # Dynamic route for displaying stock details (e.g., /stock/AAPL)
├── assets/                     # Static assets like images and fonts
│   └── images/
│       ├── favicon.png
│       └── icon.png
├── components/                 # Reusable UI components
│   ├── BalanceCard.tsx         # Displays user's current balance
│   ├── ChatInput.tsx           # Input field for chat messages
│   ├── ChatList.tsx            # Displays a list of chat messages
│   ├── ChatMessage.tsx         # Individual chat message item
│   ├── MarketOverview.tsx      # Component for displaying market trends or summaries
│   ├── PortfolioItem.tsx       # Displays a single item in the user's portfolio
│   ├── StockChart.tsx          # Component for rendering stock price charts
│   ├── StockItem.tsx           # Displays a single stock in a list (e.g., search results, watchlist)
│   ├── TradeForm.tsx           # Form for buying or selling stocks
│   └── TransactionItem.tsx     # Displays a single transaction in the history
├── context/                    # React Context API providers for global state management
│   ├── AuthContext.tsx         # Manages authentication state (user login, tokens)
│   ├── ChatContext.tsx         # Manages chat messages and related state
│   ├── ProfileContext.tsx      # Manages user profile data
│   └── UserContext.tsx         # Manages user-specific data like balance, portfolio, stocks, transactions, watchlist
├── hooks/                      # Custom React hooks
│   └── useFrameworkReady.ts    # Hook to signal when the framework/app is ready
├── types/                      # TypeScript type definitions
│   └── stocks.ts               # Defines types for Stock, Portfolio, Transaction, etc.
└── utils/                      # Utility functions
    ├── geminiApi.ts            # Functions for interacting with the Google Gemini API
    └── stockUtils.ts           # Utility functions for stock data (e.g., generating initial stocks, formatting currency)
```

## 4. Key Features and Modules

### 4.1. App Entry & Layout

*   **`app/_layout.tsx`**: This is the root layout component for the entire application. It sets up global providers (Context APIs) and initial navigation structures. It handles font loading, theme detection, and establishes the foundation for the app's navigation.
*   **`app/(tabs)/_layout.tsx`**: Defines the layout for the main tab-based navigation. It configures the bottom tab bar, including icons and screen associations for the main sections of the app (dashboard, portfolio, markets, search, chat, history, profile).
*   **`app/index.tsx`**: The initial screen loaded when the app starts. It handles redirection to the login screen or the main app (tabs) based on authentication status.

### 4.2. Authentication

*   **Screens**:
    *   `app/login.tsx`: Provides the UI for user login with email and password fields, validation, and submission handling.
    *   `app/register.tsx`: Provides the UI for new user registration with fields for username, email, password, and confirmation.
*   **State Management**:
    *   `context/AuthContext.tsx`: Manages the user's authentication status, storing user tokens or session information. It provides functions for login, logout, and registration, with appropriate error handling and validation.

### 4.3. Main Application Screens (Tabs)

*   **`app/(tabs)/index.tsx` (Dashboard/Home)**: The main landing screen after login. Displays a summary of the user's portfolio, market overview, and quick access to other features. Shows balance information, recent market trends, and portfolio performance.
*   **`app/(tabs)/markets.tsx`**: Displays an overview of the stock market, showing top gainers, losers, trending stocks, and market indices. Provides filtering options and search functionality.
*   **`app/(tabs)/portfolio.tsx`**: Shows the user's current stock holdings, including quantity, average price, current value, and profit/loss for each stock. Includes a summary of total portfolio value and performance metrics.
*   **`app/(tabs)/search.tsx`**: Allows users to search for stocks by symbol or company name. Displays search results with key information and quick actions.
*   **`app/(tabs)/history.tsx`**: Displays a list of the user's past transactions (buy/sell orders) with filtering options and detailed information about each transaction.
*   **`app/(tabs)/chat.tsx`**: Provides a chat interface powered by the Google Gemini API, for users to ask questions about stocks, trading strategies, or market information. Includes message history and interactive responses.
*   **`app/(tabs)/profile.tsx`**: Allows users to view and manage their profile information, including personal details, preferences, settings, and account management options.

### 4.4. Stock Details

*   **`app/stock/[symbol].tsx`**: This is a dynamic route that displays detailed information about a specific stock. The `[symbol]` part of the path is a parameter representing the stock's ticker symbol (e.g., `AAPL`, `GOOGL`). This screen shows:
    *   Current price and price change.
    *   A historical price chart (`components/StockChart.tsx`).
    *   Company information and key statistics.
    *   A trade form (`components/TradeForm.tsx`) to buy or sell the stock.
    *   An option to add/remove from the watchlist.
    *   News and recent developments related to the stock.

### 4.5. State Management (React Context API)

The application uses the React Context API for managing global and shared state.

*   **`context/UserContext.tsx`**:
    *   **Purpose**: Manages core user-specific financial and trading data.
    *   **State**:
        *   `balance`: User's available trading balance.
        *   `stocks`: List of all available stocks in the simulation, including their current prices. Prices are periodically refreshed.
        *   `portfolio`: User's current stock holdings. Each item includes symbol, company name, quantity, average purchase price, and total cost.
        *   `transactions`: A history of all buy and sell transactions made by the user.
        *   `watchlist`: A list of stock symbols the user is tracking.
    *   **Functions**:
        *   `setBalance`: Updates the user's balance.
        *   `refreshStocks`: Updates the prices of stocks (simulated).
        *   `addToPortfolio`: Adds a purchased stock to the portfolio, updates balance and transactions.
        *   `sellFromPortfolio`: Sells a stock from the portfolio, updates balance and transactions.
        *   `addToWatchlist`, `removeFromWatchlist`, `isInWatchlist`: Manage the user's watchlist.
    *   **Data Persistence**: Uses `AsyncStorage` to load and save `balance`, `portfolio`, `transactions`, and `watchlist` data, ensuring persistence across app sessions.

*   **`context/AuthContext.tsx`**:
    *   **Purpose**: Manages user authentication state.
    *   **State**: User session, authentication tokens, loading status.
    *   **Functions**: `login()`, `logout()`, `register()`, `checkAuthStatus()`.
    *   **Security**: Handles secure storage of authentication tokens and user credentials.

*   **`context/ChatContext.tsx`**:
    *   **Purpose**: Manages the state for the chat feature.
    *   **State**: Chat messages, loading indicators for API calls, error states.
    *   **Functions**: `sendMessage()`, `loadMessages()`, `clearChat()`.
    *   **API Integration**: Handles communication with the Google Gemini API, including request formatting and response parsing.

*   **`context/ProfileContext.tsx`**:
    *   **Purpose**: Manages user profile information.
    *   **State**: Profile data including username, email, preferences, settings.
    *   **Functions**: `updateProfile()`, `loadProfile()`, `updateSettings()`.
    *   **Data Persistence**: Saves profile information to `AsyncStorage` for persistence.

### 4.6. UI Components (`components/`)

This directory contains reusable UI elements used throughout the application.

*   **`BalanceCard.tsx`**: Displays the user's current trading balance with visual indicators for changes.
*   **`ChatInput.tsx`**: A text input component specifically designed for sending messages in the chat interface, with support for typing indicators and message submission.
*   **`ChatList.tsx`**: Renders a list of chat messages, using `ChatMessage.tsx` for individual items and handling scroll behavior and loading states.
*   **`ChatMessage.tsx`**: Represents a single message bubble in the chat interface (user or bot), with appropriate styling and formatting.
*   **`MarketOverview.tsx`**: A component to display a summary of market conditions or key stock movements, including indices, trends, and notable stocks.
*   **`PortfolioItem.tsx`**:
    *   **Purpose**: Renders a single stock holding within the user's portfolio list.
    *   **Displays**: Stock symbol, company name, quantity held, average purchase price, current price, market value, and profit/loss (both absolute and percentage).
    *   **Functionality**: Navigates to the stock detail screen (`/stock/[symbol]`) when pressed.
    *   **Dynamic Styling**: Adapts to light/dark mode using `useColorScheme`.
*   **`StockChart.tsx`**: Renders a chart to visualize stock price history, with options for different time periods and chart types.
*   **`StockItem.tsx`**: A generic component to display a stock in a list (e.g., in search results or watchlist). Shows symbol, company name, and current price with appropriate styling.
*   **`TradeForm.tsx`**: Provides input fields for quantity and allows users to execute buy or sell orders for a specific stock, with validation and confirmation steps.
*   **`TransactionItem.tsx`**: Displays details of a single past transaction (buy/sell, stock, quantity, price, date) with appropriate styling based on transaction type.

### 4.7. Custom Hooks (`hooks/`)

*   **`hooks/useFrameworkReady.ts`**:
    *   **Purpose**: A hook that calls `window.frameworkReady?.()` when the component it's used in mounts. This signals to external tools (e.g., end-to-end testing frameworks) that the React Native application has loaded and is ready for interaction, particularly in web builds.

### 4.8. Type Definitions (`types/`)

*   **`types/stocks.ts`**: Contains TypeScript interfaces and types for data structures used throughout the application, such as:
    *   `Stock`: Defines the structure for a stock (symbol, company name, price, price change, etc.).
    *   `Portfolio`: Defines the structure for an item in the user's portfolio (symbol, quantity, average price, etc.).
    *   `Transaction`: Defines the structure for a transaction record (type, symbol, quantity, price, date, etc.).
    *   `User`: Defines the structure for user data.
    *   `ChatMessage`: Defines the structure for chat messages.
    *   Other related types for API responses or specific data models.

### 4.9. Utility Functions (`utils/`)

*   **`utils/stockUtils.ts`**:
    *   **Purpose**: Provides helper functions related to stock data.
    *   **Functions**:
        *   `generateInitialStocks()`: Creates an initial list of stocks with simulated data, updating prices based on previous state for a dynamic feel.
        *   `formatCurrency()`: Formats numerical values into a currency string (e.g., `$1,234.56`).
        *   `calculateProfitLoss()`: Calculates profit/loss for a stock position.
        *   `generateChartData()`: Creates simulated chart data for stock price history.
        *   Other utility functions for calculations or data manipulation related to stocks.
*   **`utils/geminiApi.ts`**:
    *   **Purpose**: Encapsulates the logic for interacting with the Google Gemini API.
    *   **Functions**: Includes functions to send prompts/messages to the Gemini API and receive responses, handling API keys and request/response formatting.
    *   **Error Handling**: Manages API errors and provides fallback responses when needed.

## 5. Data Flow

1.  **App Initialization**:
    *   Root layout (`app/_layout.tsx`) sets up context providers.
    *   `UserContext` attempts to load persisted data (balance, portfolio, transactions, watchlist) from `AsyncStorage`.
    *   `UserContext` calls `refreshStocks()` (which uses `generateInitialStocks()`) to populate or update the list of available stocks and their prices.
2.  **User Authentication**:
    *   User interacts with `login.tsx` or `register.tsx`.
    *   `AuthContext` handles authentication logic, updates its state.
    *   Navigation directs the user to the main app (tabs) upon successful authentication.
3.  **Viewing Stocks/Portfolio**:
    *   Screens like `portfolio.tsx` or `stock/[symbol].tsx` consume data from `UserContext` (portfolio, stocks).
    *   `PortfolioItem.tsx` calculates profit/loss based on current stock prices from `UserContext.stocks` and purchase data from `UserContext.portfolio`.
4.  **Trading (Buy/Sell)**:
    *   User interacts with `TradeForm.tsx` on a stock detail page.
    *   On submitting a trade:
        *   `UserContext.addToPortfolio()` or `UserContext.sellFromPortfolio()` is called.
        *   These functions validate the trade (e.g., sufficient balance, shares owned).
        *   They update `balance`, `portfolio`, and `transactions` state within `UserContext`.
        *   `UserContext` then persists these changes to `AsyncStorage`.
5.  **Chat Interaction**:
    *   User types a message in `ChatInput.tsx` on the `chat.tsx` screen.
    *   `ChatContext` (or a function within `chat.tsx` using `geminiApi.ts`) sends the message to the Google Gemini API.
    *   The API response is received, and `ChatContext` updates the list of messages, which are then rendered by `ChatList.tsx`.
6.  **Data Persistence**:
    *   `UserContext` uses a `useEffect` hook to monitor changes in `balance`, `portfolio`, `transactions`, and `watchlist`.
    *   Whenever these pieces of state change, the `saveData()` function is triggered to write the updated state to `AsyncStorage`.

## 6. Navigation (`expo-router`)

*   **File-System Based**: `expo-router` uses the directory structure within the `app/` folder to define routes.
    *   `app/index.tsx` -> `/`
    *   `app/login.tsx` -> `/login`
    *   `app/(tabs)/portfolio.tsx` -> `/portfolio` (assuming `(tabs)` is a group without a path segment)
    *   `app/stock/[symbol].tsx` -> `/stock/:symbol` (dynamic route)
*   **Layouts**:
    *   `_layout.tsx` files define shared UI and configuration for segments of the app.
    *   The root `app/_layout.tsx` wraps the entire application.
    *   `app/(tabs)/_layout.tsx` specifically configures the bottom tab navigator.
*   **Navigation Actions**:
    *   The `useRouter` hook from `expo-router` is used for programmatic navigation (e.g., `router.push('/stock/AAPL')`, `router.replace('/login')`).
    *   Link components can also be used for declarative navigation.

## 7. Styling and Theming

*   **StyleSheet API**: Standard React Native `StyleSheet.create()` is used for defining component styles.
*   **Dynamic Theming**: The application supports light and dark modes.
    *   `useColorScheme()` hook from `react-native` is used to detect the user's preferred color scheme.
    *   Styles are dynamically applied based on the `colorScheme` value, as seen in components like `PortfolioItem.tsx`.
*   **Consistent Design Language**: The application maintains a consistent design language across all screens and components.
*   **Responsive Design**: The UI adapts to different screen sizes and orientations.
*   **Accessibility**: The application includes accessibility features like proper contrast ratios and screen reader support.

## 8. Security Considerations

*   **Authentication**: User authentication is handled securely through the `AuthContext`.
*   **Data Storage**: Sensitive data is stored securely using `AsyncStorage`.
*   **API Keys**: API keys for services like Google Gemini are handled securely and not exposed in client-side code.
*   **Input Validation**: All user inputs are validated to prevent security vulnerabilities.
*   **Error Handling**: Robust error handling is implemented throughout the application to prevent crashes and security issues.

## 9. Performance Optimization

*   **Memoization**: React's `useMemo` and `useCallback` hooks are used to optimize rendering performance.
*   **Lazy Loading**: Components and screens are loaded lazily to improve initial load time.
*   **List Virtualization**: Large lists use virtualization to improve performance.
*   **Image Optimization**: Images are optimized for performance and loaded efficiently.
*   **State Management**: The application uses efficient state management techniques to minimize unnecessary re-renders.

## 10. Testing

*   **Unit Testing**: Individual components and functions can be tested in isolation.
*   **Integration Testing**: Interactions between components and contexts can be tested.
*   **End-to-End Testing**: The application can be tested as a whole to ensure all features work together correctly.
*   **Manual Testing**: The application should be manually tested on different devices and platforms.

## 11. Deployment

*   **Expo Build**: The application can be built for iOS and Android using Expo's build service.
*   **App Store/Google Play**: The application can be published to the App Store and Google Play.
*   **Web Deployment**: The application can be deployed as a web application using `expo export --platform web`.

## 12. Future Enhancements

*   **Real Stock Data**: Integration with real stock market APIs to provide actual stock data.
*   **Social Features**: Adding social features like sharing portfolios or competing with friends.
*   **Advanced Analytics**: More advanced analytics and visualization tools for portfolio performance.
*   **Notifications**: Push notifications for price alerts, news, or transaction confirmations.
*   **Expanded AI Integration**: Enhanced AI features for stock recommendations and market analysis.

## 13. Conclusion

StockMarketSimu is a comprehensive stock market simulation application built with modern technologies. It provides users with a realistic trading experience, complete with portfolio management, market tracking, and AI-powered chat assistance. The application is designed to be scalable, maintainable, and user-friendly, with a focus on performance and security.

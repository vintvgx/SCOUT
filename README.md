# SCOUT

## Overview

SCOUT is a React Native application designed to track issues and errors for your projects using the Sentry API. This app provides real-time error tracking through notifications and integrates with ipGeolocation to display the location of IP addresses for each event. Additionally, it utilizes MapView from react-native-maps to visualize these geolocations, helping you gain insights into user engagement and application performance.

## Features

- **Real-time Error Tracking**: Receive notifications for errors as they occur.
- **IP Geolocation**: Display the location of IP addresses associated with events.
- **Geolocation Visualization**: Use MapView to visualize the geographic locations of your users.
- **User Engagement Monitoring**: Track user interactions with your applications.

## Technologies Used

### Frontend

- **React Native**: Framework for building native apps using React.
- **Expo**: Set of tools and services for React Native, including:
  - `expo`: Core library.
  - `expo-build-properties`: Manage build properties.
  - `expo-dev-client`: Development client for Expo apps.
  - `expo-device`: Access device information.
  - `expo-linear-gradient`: Create linear gradients.
  - `expo-notifications`: Manage notifications.
  - `expo-secure-store`: Secure storage for sensitive data.
  - `expo-status-bar`: Manage the status bar.
  - `expo-system-ui`: System UI management.
- **React Navigation**: Navigation library for React Native, including:
  - `@react-navigation/bottom-tabs`: Bottom tab navigator.
  - `@react-navigation/material-top-tabs`: Material design top tabs.
  - `@react-navigation/native`: Core navigation library.
  - `@react-navigation/native-stack`: Native stack navigator.
  - `@react-navigation/stack`: Stack navigator.
- **Redux Toolkit**: State management library.
- **Axios**: Promise-based HTTP client.
- **Moti**: Library for animations.
- **React Native Libraries**:
  - `react-native-chart-kit`: Chart library.
  - `react-native-dotenv`: Environment variables.
  - `react-native-gesture-handler`: Gesture handling.
  - `react-native-maps`: Map library.
  - `react-native-pager-view`: Pager view component.
  - `react-native-reanimated`: Animation library.
  - `react-native-safe-area-context`: Safe area insets.
  - `react-native-screens`: Native screens.
  - `react-native-svg`: SVG support.
  - `react-native-tab-view`: Tab view component.
  - `react-native-vector-icons`: Vector icons.

### Backend and APIs

- **Firebase**: Backend as a service, including:
  - `firebase`: Core Firebase library.
  - `@react-native-firebase/app`: Firebase integration.
  - `@react-native-firebase/messaging`: Firebase messaging.
  - `firebase-admin`: Admin SDK.
  - `firebase-functions`: Cloud functions.
- **Sentry API**: Error tracking and monitoring.
- **ipGeolocation API**: IP address geolocation service.

### Notifications

- **Expo Notifications**: Notifications handling.
- **Apple Push Notifications**: Push notifications for iOS devices.

### Utilities

- **Bottleneck**: Rate limiting.
- **Dotenv**: Environment variables.
- **Pretty-format**: Data formatting.
- **Typescript**: Typed superset of JavaScript.
- **Loading-skeleton**: Display loading skeletons while fetching data.

### Development Tools

- **Babel**: JavaScript compiler.
- **TypeScript**: Typed superset of JavaScript.

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/scout.git
   cd scout
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your API keys and other configuration details.

4. **Run the application**:
   ```bash
   expo start
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or new features to suggest.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.

---

Feel free to reach out with any questions or feedback. Happy coding!

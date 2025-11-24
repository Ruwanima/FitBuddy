# FitBuddy - Health & Wellness Mobile App

A comprehensive fitness tracking mobile application built with React Native (Expo) for the IN3210 Mobile Applications Development course.

## 📱 About

FitBuddy is a cross-platform mobile application designed to help users track exercises, manage wellness routines, and maintain a healthy lifestyle. The app features a clean, modern UI with support for both light and dark themes.

## ✨ Features

### Core Features
- **User Authentication**: Complete registration and login flow with form validation
- **Exercise Browsing**: Browse a comprehensive list of exercises fetched from API
- **Exercise Details**: View detailed information about each exercise including:
  - Duration, calories burned, difficulty level
  - Benefits and required equipment
  - High-quality images and ratings
- **Favorites System**: Save favorite exercises with local persistence
- **User Profile**: View statistics and manage account settings
- **Dark Mode**: Toggle between light and dark themes (Bonus Feature)

### Technical Highlights
- Redux Toolkit for state management
- React Navigation (Stack + Bottom Tabs)
- Secure local storage with AsyncStorage
- Form validation using Yup
- API integration with DummyJSON
- Feather Icons for consistent iconography
- Responsive design for all screen sizes

## 🏗️ Architecture

```
FitBuddy/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ExerciseCard.js
│   │   ├── LoadingSpinner.js
│   │   └── EmptyState.js
│   ├── navigation/          # Navigation structure
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── MainNavigator.js
│   ├── redux/              # State management
│   │   ├── store.js
│   │   ├── authSlice.js
│   │   ├── exerciseSlice.js
│   │   ├── favoritesSlice.js
│   │   └── themeSlice.js
│   ├── screens/            # Screen components
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── HomeScreen.js
│   │   ├── DetailsScreen.js
│   │   ├── FavoritesScreen.js
│   │   └── ProfileScreen.js
│   ├── services/           # API services
│   │   └── api.js
│   ├── styles/             # Theme and styling
│   │   └── theme.js
│   └── utils/              # Utility functions
│       ├── constants.js
│       ├── storage.js
│       └── validation.js
├── App.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for mobile testing)

### Installation

1. Navigate to the project directory:
```bash
cd FitBuddy
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
# or
expo start
```

4. Run on your device:
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press 'a' for Android emulator
   - Or press 'i' for iOS simulator (macOS only)

## 🔐 Demo Credentials

For testing the login functionality:
- **Username**: emilys
- **Password**: emilyspass

## 📦 Dependencies

### Core
- **React Native**: 0.81.5
- **Expo**: ~54.0.25
- **React**: 19.1.0

### Navigation
- @react-navigation/native: ^7.1.21
- @react-navigation/stack: ^7.6.5
- @react-navigation/bottom-tabs: ^7.8.6

### State Management
- @reduxjs/toolkit: ^2.10.1
- react-redux: ^9.2.0

### Storage & API
- @react-native-async-storage/async-storage: ^2.2.0
- axios: ^1.13.2

### UI & Icons
- react-native-vector-icons: ^10.3.0
- react-native-feather: ^1.1.2

### Validation
- yup: ^1.7.1

## 🎨 Key Features Implementation

### 1. User Authentication
- Registration with username, email, password validation
- Login with secure credential handling
- Persistent authentication state
- Form validation with Yup schemas

### 2. Navigation Structure
- Stack Navigation for auth flow
- Bottom Tab Navigation for main app
- Nested navigators for complex flows
- Smooth transitions between screens

### 3. Home Screen
- Dynamic exercise list from API
- Pull-to-refresh functionality
- Exercise cards with images and details
- Category, difficulty, and status badges

### 4. State Management
- Redux Toolkit for centralized state
- Separate slices for auth, exercises, favorites, theme
- Persistent state with AsyncStorage

### 5. Favorites System
- Add/remove favorites with toggle
- Persistent storage of favorites
- Dedicated favorites screen
- Real-time UI updates

### 6. Styling & UI
- Light and dark theme support
- Consistent color palette
- Feather icons throughout
- Responsive layouts
- Smooth animations

## 🌐 API Integration

Uses DummyJSON API (https://dummyjson.com) for:
- User authentication
- Exercise data (transformed from products endpoint)
- User profile information

## 📱 Screenshots

(Screenshots should be added in the deliverables showing Login, Home, Details, Favorites, and Profile screens in both light and dark modes)

## 🎯 Assignment Requirements Met

✅ User Authentication with validation  
✅ React Hooks for form handling  
✅ Navigation (Stack + Bottom Tabs)  
✅ Home screen with dynamic API data  
✅ Item cards with images and details  
✅ Details screen on item tap  
✅ Redux Toolkit state management  
✅ Favorites functionality  
✅ Persistent data storage  
✅ Consistent styling with Feather Icons  
✅ Responsive design  
✅ **Bonus**: Dark mode toggle  

## 👨‍💻 Developer

**Student**: 224166P  
**Course**: IN3210 Mobile Applications Development  
**Institution**: University of Moratuwa  

## 📝 License

This project is created for educational purposes as part of the IN3210 course assignment.

## 🙏 Acknowledgments

- DummyJSON API for test data
- React Native & Expo communities
- University of Moratuwa - Faculty of Information Technology

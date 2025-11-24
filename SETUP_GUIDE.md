# FitBuddy - Setup and Running Guide

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Expo CLI**
   - Install globally: `npm install -g expo-cli`

4. **Expo Go App** (for testing on physical device)
   - Download from App Store (iOS) or Google Play Store (Android)

## 🚀 Installation Steps

### Step 1: Navigate to Project Directory
```bash
cd "d:\mobile app\FitBuddy"
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- React Navigation
- Redux Toolkit
- Axios
- AsyncStorage
- React Native Vector Icons
- Yup validation
- And more...

### Step 3: Start the Development Server
```bash
npm start
```

OR

```bash
expo start
```

This will start the Metro bundler and display a QR code.

## 📱 Running the App

### Option 1: On Physical Device (Recommended)

1. **Install Expo Go**:
   - iOS: Download from App Store
   - Android: Download from Google Play Store

2. **Connect to Same Network**:
   - Ensure your phone and computer are on the same WiFi network

3. **Scan QR Code**:
   - iOS: Open Camera app and scan the QR code
   - Android: Open Expo Go app and scan the QR code

4. **Wait for Build**:
   - The app will build and load on your device

### Option 2: On Android Emulator

1. **Setup Android Studio** (if not already installed):
   - Download from: https://developer.android.com/studio
   - Install Android SDK and create a virtual device

2. **Start Emulator**:
   - Open Android Studio
   - Start your virtual device

3. **Run App**:
   - In terminal, press `a` when Expo dev server is running
   - Or run: `npm run android`

### Option 3: On iOS Simulator (macOS only)

1. **Install Xcode** (from Mac App Store)

2. **Run App**:
   - In terminal, press `i` when Expo dev server is running
   - Or run: `npm run ios`

### Option 4: Web Browser

```bash
npm run web
```

Then press `w` in terminal or open: http://localhost:19006

## 🔐 Demo Login Credentials

The app uses DummyJSON API for authentication. Use these credentials:

```
Username: emilys
Password: emilyspass
```

Or register a new account (simulated registration).

## 🎯 Testing the App

### 1. Authentication Flow
- Launch app → Login screen appears
- Click "Create New Account" to test registration
- Fill in all fields (validation will check format)
- Or use demo credentials to login
- Successfully login → Navigate to Home screen

### 2. Home Screen
- View list of exercises fetched from API
- Each card shows: image, title, category, duration, calories, difficulty
- Pull down to refresh data
- Username displayed in header

### 3. Exercise Details
- Tap any exercise card
- View detailed information
- See benefits, equipment needed, rating
- Toggle favorite (heart icon)

### 4. Favorites
- Navigate to Favorites tab
- View all saved favorite exercises
- Tap any to view details
- Unfavorite by tapping heart icon

### 5. Profile
- Navigate to Profile tab
- View user information
- See favorite count
- Toggle dark mode
- Clear all favorites
- Logout

### 6. Dark Mode (Bonus Feature)
- Go to Profile tab
- Toggle "Dark Mode" switch
- Watch entire app theme change
- Theme persists after app restart

## 🛠️ Troubleshooting

### Issue: "Unable to resolve module"
```bash
npm install
expo start --clear
```

### Issue: Metro bundler issues
```bash
expo start -c
# or
npx expo start --clear
```

### Issue: Package conflicts
```bash
rm -rf node_modules
npm install
```

### Issue: Can't connect on physical device
- Ensure both devices on same WiFi
- Disable VPN
- Try tunnel mode: `expo start --tunnel`

## 📦 Project Structure

```
FitBuddy/
├── src/
│   ├── components/       # Reusable components
│   ├── navigation/       # Navigation setup
│   ├── redux/           # State management
│   ├── screens/         # Screen components
│   ├── services/        # API services
│   ├── styles/          # Themes and styles
│   └── utils/           # Helper functions
├── App.js               # Root component
├── package.json         # Dependencies
├── app.json            # Expo configuration
└── README.md           # Documentation
```

## 🔍 Key Features to Test

✅ User registration with validation  
✅ User login with error handling  
✅ API data fetching  
✅ Exercise cards display  
✅ Navigation between screens  
✅ Exercise details view  
✅ Add to favorites  
✅ View favorites list  
✅ Remove from favorites  
✅ Dark mode toggle  
✅ Persistent storage  
✅ Pull to refresh  
✅ Logout functionality  

## 📸 Screenshots Locations

After testing, capture screenshots of:
1. Login Screen
2. Registration Screen
3. Home Screen (with exercise list)
4. Exercise Details Screen
5. Favorites Screen
6. Profile Screen
7. Dark Mode examples

## 🎥 Demo Video Recording

Record a 2-minute demo showing:
1. App launch (0:00-0:05)
2. Login/Registration (0:05-0:20)
3. Home screen browsing (0:20-0:40)
4. Viewing exercise details (0:40-1:00)
5. Adding to favorites (1:00-1:20)
6. Profile & settings (1:20-1:45)
7. Dark mode toggle (1:45-2:00)

## 📝 Code Quality Highlights

- **Modular Structure**: Feature-based organization
- **Reusable Components**: DRY principle applied
- **Type Safety**: Proper prop validation
- **Error Handling**: Try-catch blocks and user feedback
- **Best Practices**: React Hooks, Redux best practices
- **Clean Code**: Consistent naming, comments, formatting
- **Performance**: Optimized re-renders, lazy loading
- **Security**: Secure storage for sensitive data

## 🚀 Deployment (Optional)

### Build for Android:
```bash
expo build:android
```

### Build for iOS:
```bash
expo build:ios
```

## 📞 Support

For issues or questions:
- Check the README.md
- Review the code comments
- Check Expo documentation: https://docs.expo.dev/

## ✅ Assignment Checklist

Before submission, ensure:
- [ ] All dependencies installed
- [ ] App runs without errors
- [ ] All features working
- [ ] Screenshots captured
- [ ] Demo video recorded (≤2 min)
- [ ] Code pushed to GitHub
- [ ] README.md complete
- [ ] Comments in code
- [ ] Git commits are feature-based

---

**Student ID**: 224166P  
**Course**: IN3210 Mobile Applications Development  
**Assignment**: Cross-Platform Mobile Development with React Native  
**Date**: November 2025

# Git Setup and Commit Guide for FitBuddy

## Initial Git Setup

### 1. Initialize Git Repository
```bash
cd "d:\mobile app\FitBuddy"
git init
```

### 2. Create .gitignore (if not exists)
Create a `.gitignore` file with the following content:

```
# Node modules
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Expo
.expo/
.expo-shared/
dist/
web-build/

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
.DS_Store
*.pem

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Build
build/
*.apk
*.ipa
android/app/build/
ios/build/
```

### 3. Configure Git User (if not done)
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Feature-Based Commits

Following best practices, create commits for each major feature:

### Initial Setup
```bash
git add package.json app.json README.md SETUP_GUIDE.md
git commit -m "Initial project setup with Expo and dependencies"
```

### Project Structure
```bash
git add src/utils/ src/styles/
git commit -m "Add utility functions, constants, and theme configuration"
```

### State Management
```bash
git add src/redux/
git commit -m "Implement Redux store with auth, exercise, favorites, and theme slices"
```

### API Services
```bash
git add src/services/
git commit -m "Add API service layer for authentication and fitness data"
```

### Reusable Components
```bash
git add src/components/
git commit -m "Create reusable UI components (ExerciseCard, LoadingSpinner, EmptyState)"
```

### Authentication Screens
```bash
git add src/screens/LoginScreen.js src/screens/RegisterScreen.js
git commit -m "Implement user authentication with login and registration screens"
```

### Main App Screens
```bash
git add src/screens/HomeScreen.js src/screens/DetailsScreen.js
git commit -m "Add home screen with exercise list and details view"
```

### Favorites Feature
```bash
git add src/screens/FavoritesScreen.js
git commit -m "Implement favorites functionality with persistent storage"
```

### Profile Management
```bash
git add src/screens/ProfileScreen.js
git commit -m "Add user profile screen with settings and statistics"
```

### Navigation Setup
```bash
git add src/navigation/
git commit -m "Configure app navigation with stack and tab navigators"
```

### Root App Configuration
```bash
git add App.js
git commit -m "Integrate Redux store and navigation in root App component"
```

### Dark Mode (Bonus)
```bash
git add src/redux/themeSlice.js src/styles/theme.js
git commit -m "Bonus: Add dark mode support with theme toggle"
```

### Documentation
```bash
git add README.md SETUP_GUIDE.md GIT_GUIDE.md
git commit -m "Add comprehensive documentation and setup guides"
```

## Complete Commit (Alternative)

If you prefer a single commit after completing everything:

```bash
git add .
git commit -m "Complete FitBuddy app with all features

- User authentication (login/register) with validation
- Home screen with exercise list from API
- Exercise details screen with full information
- Favorites functionality with persistent storage
- User profile with statistics and settings
- Redux Toolkit state management
- Stack and Bottom Tab navigation
- Dark mode support (bonus feature)
- Responsive design with Feather icons
- Form validation using Yup
- API integration with DummyJSON
- AsyncStorage for data persistence"
```

## Push to GitHub

### 1. Create Repository on GitHub
- Go to https://github.com
- Click "New Repository"
- Name it: `FitBuddy` or `IN3210-Assignment2`
- Don't initialize with README (we already have one)
- Click "Create Repository"

### 2. Add Remote and Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/FitBuddy.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Viewing Commit History

```bash
# View all commits
git log

# View commits with changes
git log --stat

# View compact history
git log --oneline

# View graphical history
git log --graph --oneline --all
```

## Best Practices Applied

✅ **Feature-based commits**: Each commit represents a complete feature  
✅ **Descriptive messages**: Clear commit messages explaining changes  
✅ **Logical grouping**: Related files committed together  
✅ **Documentation**: README and guides included  
✅ **Clean history**: Well-organized commit timeline  

## Submission Checklist

Before submitting, verify:

- [ ] All code committed to Git
- [ ] Repository pushed to GitHub
- [ ] Repository is public or accessible to instructor
- [ ] README.md is comprehensive
- [ ] .gitignore properly configured
- [ ] No node_modules committed
- [ ] All sensitive data excluded
- [ ] Commit messages are clear
- [ ] Repository URL ready for submission

## Example GitHub Repository Structure

```
FitBuddy/
├── .gitignore
├── README.md
├── SETUP_GUIDE.md
├── GIT_GUIDE.md
├── package.json
├── app.json
├── App.js
└── src/
    ├── components/
    ├── navigation/
    ├── redux/
    ├── screens/
    ├── services/
    ├── styles/
    └── utils/
```

## Repository URL Format

Your submission should include:
```
https://github.com/YOUR_USERNAME/FitBuddy
```

## Additional Git Commands

```bash
# Check status
git status

# See changes
git diff

# Undo changes to a file
git checkout -- filename

# Create a branch
git checkout -b feature-name

# Switch branches
git checkout main

# Merge branches
git merge feature-name
```

---

**Note**: Make sure to test the app thoroughly before final commit and push!

**Student ID**: 224166P  
**Assignment**: IN3210 - Assignment 2  
**Date**: November 2025

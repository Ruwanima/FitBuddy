# FitBuddy Quick Start Commands

## Windows PowerShell Commands

### First Time Setup
```powershell
cd "d:\mobile app\FitBuddy"
npm install
```

### Start Development Server
```powershell
cd "d:\mobile app\FitBuddy"
npm start
```

### Alternative Start Commands
```powershell
# Start with clear cache
npm start -- --clear

# Start for Android
npm run android

# Start for web
npm run web
```

### Troubleshooting Commands
```powershell
# Clear cache and restart
npx expo start --clear

# Reinstall dependencies
rm -r -fo node_modules
npm install

# Check for updates
npm outdated
```

## Quick Commands Reference

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |
| `expo start --clear` | Start with cleared cache |
| `expo start --tunnel` | Start with tunnel (for network issues) |

## After Starting

When the dev server starts:
- **Scan QR code** with Expo Go app
- Press **a** for Android emulator
- Press **w** for web browser
- Press **r** to reload app
- Press **m** for more options

## Demo Login Credentials

```
Username: emilys
Password: emilyspass
```

## Project Commands

```powershell
# Navigate to project
cd "d:\mobile app\FitBuddy"

# Install dependencies
npm install

# Start development
npm start

# View project structure
tree /F

# Check Git status
git status

# Create Git repository
git init
git add .
git commit -m "Complete FitBuddy app"
```

## Testing Checklist

1. ✅ Start app: `npm start`
2. ✅ Scan QR code on phone
3. ✅ Login with demo credentials
4. ✅ Browse exercises on Home
5. ✅ View exercise details
6. ✅ Add to favorites
7. ✅ Check Favorites tab
8. ✅ Toggle dark mode in Profile
9. ✅ Logout and login again

## Success Indicators

When app is working correctly:
- ✅ No errors in terminal
- ✅ Login screen appears
- ✅ Can login successfully
- ✅ Exercises load from API
- ✅ Navigation works smoothly
- ✅ Favorites persist
- ✅ Dark mode toggles

## Need Help?

1. Check `SETUP_GUIDE.md` for detailed instructions
2. Check `SUBMISSION_CHECKLIST.md` for testing
3. Check `README.md` for full documentation
4. Check Expo documentation: https://docs.expo.dev

---

**Quick Start**: Just run `npm start` in the FitBuddy directory!

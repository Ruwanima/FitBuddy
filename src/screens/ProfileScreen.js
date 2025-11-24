import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import { logout } from '../redux/authSlice';
import { toggleTheme } from '../redux/themeSlice';
import { clearFavorites } from '../redux/favoritesSlice';
import { removeItem, setItem, getItem } from '../utils/storage';
import { STORAGE_KEYS, THEME_MODE } from '../utils/constants';
import { lightTheme, darkTheme } from '../styles/theme';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === THEME_MODE.LIGHT ? lightTheme : darkTheme;

  const isDarkMode = themeMode === THEME_MODE.DARK;

  const handleThemeToggle = async () => {
    dispatch(toggleTheme());
    const newTheme = isDarkMode ? THEME_MODE.LIGHT : THEME_MODE.DARK;
    await setItem(STORAGE_KEYS.THEME, newTheme);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await removeItem(STORAGE_KEYS.USER_TOKEN);
            await removeItem(STORAGE_KEYS.USER_DATA);
            dispatch(logout());
          },
        },
      ]
    );
  };

  const handleClearFavorites = () => {
    Alert.alert(
      'Clear Favorites',
      'Are you sure you want to remove all favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            dispatch(clearFavorites());
            await removeItem(STORAGE_KEYS.FAVORITES);
            Alert.alert('Success', 'All favorites have been cleared.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <View style={styles.avatarContainer}>
          <Icon name="user" size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.headerName}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.headerEmail}>{user?.email || user?.username}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>STATISTICS</Text>
          
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Icon name="heart" size={24} color={theme.primary} />
                <View style={styles.statContent}>
                  <Text style={[styles.statValue, { color: theme.text }]}>
                    {favorites.length}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                    Favorites
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>PREFERENCES</Text>
          
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={[styles.menuItem, { borderBottomColor: theme.border }]}>
              <View style={styles.menuLeft}>
                <Icon name={isDarkMode ? 'moon' : 'sun'} size={22} color={theme.text} />
                <Text style={[styles.menuText, { color: theme.text }]}>Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeToggle}
                trackColor={{ false: '#767577', true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ACTIONS</Text>
          
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomColor: theme.border }]}
              onPress={handleClearFavorites}
              disabled={favorites.length === 0}
            >
              <View style={styles.menuLeft}>
                <Icon name="trash-2" size={22} color={favorites.length === 0 ? theme.textSecondary : theme.warning} />
                <Text style={[styles.menuText, { color: favorites.length === 0 ? theme.textSecondary : theme.text }]}>
                  Clear Favorites
                </Text>
              </View>
              <Icon name="chevron-right" size={22} color={theme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <View style={styles.menuLeft}>
                <Icon name="log-out" size={22} color={theme.error} />
                <Text style={[styles.menuText, { color: theme.error }]}>Logout</Text>
              </View>
              <Icon name="chevron-right" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            FitBuddy v1.0.0
          </Text>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Made with ❤️ for IN3210
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingTop: 60,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  statRow: {
    padding: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statContent: {
    marginLeft: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default ProfileScreen;

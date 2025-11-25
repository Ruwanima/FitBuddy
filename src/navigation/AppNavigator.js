import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import { setFavorites } from '../redux/favoritesSlice';
import { setTheme } from '../redux/themeSlice';
import { getItem } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import LoadingSpinner from '../components/LoadingSpinner';
import { THEME_MODE } from '../utils/constants';

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Load saved theme
      const savedTheme = await getItem(STORAGE_KEYS.THEME);
      if (savedTheme) {
        dispatch(setTheme(savedTheme));
      }

      // Load saved auth data
      const token = await getItem(STORAGE_KEYS.USER_TOKEN);
      const userData = await getItem(STORAGE_KEYS.USER_DATA);

      if (token && userData) {
        dispatch(loginSuccess({ user: userData, token }));
      }

      // Load saved favorites
      const savedFavorites = await getItem(STORAGE_KEYS.FAVORITES);
      console.log('Loaded favorites from storage:', savedFavorites?.length || 0);
      if (savedFavorites && Array.isArray(savedFavorites)) {
        dispatch(setFavorites(savedFavorites));
      } else {
        dispatch(setFavorites([]));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading FitBuddy..." />;
  }

  return (
    <>
      <StatusBar
        style={themeMode === THEME_MODE.DARK ? 'light' : 'dark'}
        backgroundColor="transparent"
        translucent
      />
      <NavigationContainer>
        {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </>
  );
};

export default AppNavigator;

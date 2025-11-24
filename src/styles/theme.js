import { StyleSheet } from 'react-native';

export const lightTheme = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  text: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  card: '#FFFFFF',
  shadow: '#000000',
  placeholder: '#999999',
  icon: '#666666',
  tabBar: '#FFFFFF',
  statusBar: 'dark-content',
};

export const darkTheme = {
  background: '#121212',
  surface: '#1E1E1E',
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#2C2C2C',
  success: '#66BB6A',
  warning: '#FFD54F',
  error: '#EF5350',
  card: '#1E1E1E',
  shadow: '#000000',
  placeholder: '#757575',
  icon: '#B0B0B0',
  tabBar: '#1E1E1E',
  statusBar: 'light-content',
};

export const getThemeStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: theme.text,
  },
  textSecondary: {
    color: theme.textSecondary,
  },
  input: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    color: theme.text,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

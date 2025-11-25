import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
  Animated,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice';
import { authService } from '../services/api';
import { setItem } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { loginSchema } from '../utils/validation';
import { lightTheme, darkTheme } from '../styles/theme';
import { THEME_MODE } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';

const LOGO_URL = 'https://play-lh.googleusercontent.com/2LM9q5XVzX7O5L_8HeZ_b_N8PybAB6EiS_N92kAtpfR56tLfjHdbNA-hX3N4g6pCH2INAQl6r8jGusfALP2l';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === THEME_MODE.LIGHT ? lightTheme : darkTheme;

  const validateForm = async () => {
    try {
      await loginSchema.validate({ username, password }, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const handleLogin = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    dispatch(loginStart());

    const result = await authService.login(username, password);

    if (result.success) {
      const userData = {
        id: result.data.id,
        username: result.data.username,
        email: result.data.email,
        firstName: result.data.firstName,
        lastName: result.data.lastName,
      };

      await setItem(STORAGE_KEYS.USER_TOKEN, result.data.token);
      await setItem(STORAGE_KEYS.USER_DATA, userData);

      dispatch(
        loginSuccess({
          user: userData,
          token: result.data.token,
        })
      );

      Alert.alert('Success', `Welcome back, ${userData.firstName}!`);
    } else {
      dispatch(loginFailure(result.error));
      Alert.alert('Login Failed', result.error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Logging in..." />;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar
        barStyle={themeMode === THEME_MODE.LIGHT ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.logoContainer, { 
            backgroundColor: `${theme.primary}08`,
          }]}>
            <Image 
              source={{ uri: LOGO_URL }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>Welcome Back!</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Sign in to continue your fitness journey
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Username</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: errors.username ? theme.error : theme.border }]}>
              <Icon name="user" size={20} color={theme.icon} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Enter your username"
                placeholderTextColor={theme.placeholder}
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (errors.username) setErrors({ ...errors, username: null });
                }}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {username.length > 0 && (
                <View style={[styles.checkCircle, { backgroundColor: '#4CAF5015' }]}>
                  <Icon name="check" size={16} color="#4CAF50" />
                </View>
              )}
            </View>
            {errors.username && (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle" size={14} color={theme.error} />
                <Text style={[styles.errorText, { color: theme.error }]}>{errors.username}</Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Password</Text>
            <View style={[
              styles.inputWrapper, 
              { 
                backgroundColor: theme.surface, 
                borderColor: errors.password 
                  ? theme.error 
                  : focusedField === 'password' 
                    ? theme.primary 
                    : theme.border,
                borderWidth: focusedField === 'password' ? 2 : 1.5,
                shadowColor: focusedField === 'password' ? theme.primary : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: focusedField === 'password' ? 4 : 0,
              }
            ]}>
              <View style={[styles.iconCircle, { backgroundColor: `${theme.primary}15` }]}>
                <Icon name="lock" size={20} color={theme.primary} />
              </View>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Enter your password"
                placeholderTextColor={theme.placeholder}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={[styles.eyeButton, { backgroundColor: theme.background }]}
                activeOpacity={0.7}
              >
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.icon} />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle" size={14} color={theme.error} />
                <Text style={[styles.errorText, { color: theme.error }]}>{errors.password}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, { 
              backgroundColor: theme.primary,
              shadowColor: theme.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
            }]}
            onPress={handleLogin}
            activeOpacity={0.9}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Sign In</Text>
              <View style={styles.buttonIconContainer}>
                <Icon name="arrow-right" size={20} color="#FFFFFF" />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <View style={[styles.dividerCircle, { 
              backgroundColor: theme.background,
              borderColor: theme.border,
            }]}>
              <Text style={[styles.dividerText, { color: theme.textSecondary }]}>OR</Text>
            </View>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <TouchableOpacity
            style={[styles.secondaryButton, { 
              borderColor: theme.border,
              backgroundColor: theme.surface,
            }]}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.8}
          >
            <Icon name="user-plus" size={20} color={theme.text} />
            <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
              Create New Account
            </Text>
          </TouchableOpacity>

          {/* <View style={[styles.demoInfo, { 
            backgroundColor: `${theme.secondary}10`,
            borderLeftWidth: 3,
            borderLeftColor: theme.secondary,
          }]}>
            <View style={[styles.demoIconContainer, { backgroundColor: `${theme.secondary}15` }]}>
              <Icon name="info" size={18} color={theme.secondary} />
            </View>
            <View style={styles.demoTextContainer}>
              <Text style={[styles.demoTitle, { color: theme.text }]}>Demo Account</Text>
              <Text style={[styles.demoText, { color: theme.textSecondary }]}>
                Username: <Text style={styles.demoBold}>emilys</Text>
              </Text>
              <Text style={[styles.demoText, { color: theme.textSecondary }]}>
                Password: <Text style={styles.demoBold}>emilyspass</Text>
              </Text>
            </View>
          </View> */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  eyeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 4,
    gap: 6,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  buttonIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
    position: 'relative',
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
  },
  dividerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: -25,
    zIndex: 1,
  },
  dividerText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  secondaryButton: {
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    gap: 10,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  demoInfo: {
    flexDirection: 'row',
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    gap: 14,
  },
  demoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoTextContainer: {
    flex: 1,
  },
  demoTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  demoText: {
    fontSize: 14,
    marginBottom: 2,
    fontWeight: '500',
  },
  demoBold: {
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});

export default LoginScreen;
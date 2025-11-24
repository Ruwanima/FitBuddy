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

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

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

      // Save to secure storage
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
            <Icon name="activity" size={48} color="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>FitBuddy</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Your Personal Fitness Companion
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
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.username && (
              <Text style={[styles.errorText, { color: theme.error }]}>{errors.username}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Password</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: errors.password ? theme.error : theme.border }]}>
              <Icon name="lock" size={20} color={theme.icon} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Enter your password"
                placeholderTextColor={theme.placeholder}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.icon} />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={[styles.errorText, { color: theme.error }]}>{errors.password}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textSecondary }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: theme.border }]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
              Create New Account
            </Text>
          </TouchableOpacity>

          <View style={styles.demoInfo}>
            <Icon name="info" size={16} color={theme.secondary} />
            <Text style={[styles.demoText, { color: theme.textSecondary }]}>
              Demo: username: emilys, password: emilyspass
            </Text>
          </View>
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
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  demoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    padding: 12,
    gap: 8,
  },
  demoText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
});

export default LoginScreen;

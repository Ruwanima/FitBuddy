import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import { registerStart, registerSuccess, registerFailure } from '../redux/authSlice';
import { authService } from '../services/api';
import { setItem } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { registrationSchema } from '../utils/validation';
import { lightTheme, darkTheme } from '../styles/theme';
import { THEME_MODE } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';

const LOGO_URL = 'https://play-lh.googleusercontent.com/2LM9q5XVzX7O5L_8HeZ_b_N8PybAB6EiS_N92kAtpfR56tLfjHdbNA-hX3N4g6pCH2INAQl6r8jGusfALP2l';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === THEME_MODE.LIGHT ? lightTheme : darkTheme;

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validateForm = async () => {
    try {
      await registrationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      
      // Shake animation on validation error
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      
      return false;
    }
  };

  const handleRegister = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    dispatch(registerStart());

    const result = await authService.register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

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
        registerSuccess({
          user: userData,
          token: result.data.token,
        })
      );

      Alert.alert('Success', `Welcome to FitBuddy, ${userData.firstName}!`);
    } else {
      dispatch(registerFailure(result.error));
      Alert.alert('Registration Failed', result.error);
    }
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: theme.textSecondary };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 33, label: 'Weak', color: '#EF5350' };
    if (strength <= 4) return { strength: 66, label: 'Medium', color: '#FFA726' };
    return { strength: 100, label: 'Strong', color: '#66BB6A' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (loading) {
    return <LoadingSpinner message="Creating account..." />;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Decorative background elements */}
      <View style={[styles.decorativeCircle, styles.circle1, { backgroundColor: `${theme.primary}08` }]} />
      <View style={[styles.decorativeCircle, styles.circle2, { backgroundColor: `${theme.secondary}08` }]} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: theme.surface }]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Icon name="arrow-left" size={22} color={theme.text} />
            </TouchableOpacity>
            
            <View style={[styles.logoContainer, { backgroundColor: `${theme.primary}08` }]}>
              <Image 
                source={{ uri: LOGO_URL }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Join FitBuddy and start your fitness journey
            </Text>
          </View>

          <Animated.View style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>Username</Text>
              <View style={[
                styles.inputWrapper, 
                { 
                  backgroundColor: theme.surface, 
                  borderColor: errors.username ? theme.error : (focusedInput === 'username' ? theme.primary : theme.border),
                  borderWidth: focusedInput === 'username' ? 2 : 1,
                }
              ]}>
                <View style={[styles.iconContainer, { backgroundColor: focusedInput === 'username' ? `${theme.primary}15` : 'transparent' }]}>
                  <Icon name="user" size={20} color={focusedInput === 'username' ? theme.primary : theme.icon} />
                </View>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Choose a username"
                  placeholderTextColor={theme.placeholder}
                  value={formData.username}
                  onChangeText={(text) => handleChange('username', text)}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {formData.username.length > 0 && !errors.username && (
                  <Icon name="check-circle" size={20} color="#66BB6A" />
                )}
              </View>
              {errors.username && (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={14} color={theme.error} />
                  <Text style={[styles.errorText, { color: theme.error }]}>{errors.username}</Text>
                </View>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>Email</Text>
              <View style={[
                styles.inputWrapper, 
                { 
                  backgroundColor: theme.surface, 
                  borderColor: errors.email ? theme.error : (focusedInput === 'email' ? theme.primary : theme.border),
                  borderWidth: focusedInput === 'email' ? 2 : 1,
                }
              ]}>
                <View style={[styles.iconContainer, { backgroundColor: focusedInput === 'email' ? `${theme.primary}15` : 'transparent' }]}>
                  <Icon name="mail" size={20} color={focusedInput === 'email' ? theme.primary : theme.icon} />
                </View>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.placeholder}
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text)}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                />
                {formData.email.length > 0 && !errors.email && /\S+@\S+\.\S+/.test(formData.email) && (
                  <Icon name="check-circle" size={20} color="#66BB6A" />
                )}
              </View>
              {errors.email && (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={14} color={theme.error} />
                  <Text style={[styles.errorText, { color: theme.error }]}>{errors.email}</Text>
                </View>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>Password</Text>
              <View style={[
                styles.inputWrapper, 
                { 
                  backgroundColor: theme.surface, 
                  borderColor: errors.password ? theme.error : (focusedInput === 'password' ? theme.primary : theme.border),
                  borderWidth: focusedInput === 'password' ? 2 : 1,
                }
              ]}>
                <View style={[styles.iconContainer, { backgroundColor: focusedInput === 'password' ? `${theme.primary}15` : 'transparent' }]}>
                  <Icon name="lock" size={20} color={focusedInput === 'password' ? theme.primary : theme.icon} />
                </View>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Create a password"
                  placeholderTextColor={theme.placeholder}
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.icon} />
                </TouchableOpacity>
              </View>
              
              {/* Password Strength Indicator */}
              {formData.password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    <View 
                      style={[
                        styles.strengthFill, 
                        { 
                          width: `${passwordStrength.strength}%`, 
                          backgroundColor: passwordStrength.color 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                    {passwordStrength.label}
                  </Text>
                </View>
              )}
              
              {errors.password && (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={14} color={theme.error} />
                  <Text style={[styles.errorText, { color: theme.error }]}>{errors.password}</Text>
                </View>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>Confirm Password</Text>
              <View style={[
                styles.inputWrapper, 
                { 
                  backgroundColor: theme.surface, 
                  borderColor: errors.confirmPassword ? theme.error : (focusedInput === 'confirmPassword' ? theme.primary : theme.border),
                  borderWidth: focusedInput === 'confirmPassword' ? 2 : 1,
                }
              ]}>
                <View style={[styles.iconContainer, { backgroundColor: focusedInput === 'confirmPassword' ? `${theme.primary}15` : 'transparent' }]}>
                  <Icon name="lock" size={20} color={focusedInput === 'confirmPassword' ? theme.primary : theme.icon} />
                </View>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Confirm your password"
                  placeholderTextColor={theme.placeholder}
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleChange('confirmPassword', text)}
                  onFocus={() => setFocusedInput('confirmPassword')}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color={theme.icon} />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={14} color={theme.error} />
                  <Text style={[styles.errorText, { color: theme.error }]}>{errors.confirmPassword}</Text>
                </View>
              )}
            </View>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={handleRegister}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
              >
                <Text style={styles.buttonText}>Create Account</Text>
                <Icon name="arrow-right" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <Text style={[styles.dividerText, { color: theme.textSecondary }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={[styles.linkText, { color: theme.primary }]}>Login</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  circle1: {
    width: 300,
    height: 300,
    top: -150,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: -50,
    left: -80,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
  },
  content: {
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
  },
  logo: {
    width: 70,
    height: 70,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 58,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeButton: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 4,
    gap: 6,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
  },
  strengthContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  strengthBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  button: {
    height: 58,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  footerText: {
    fontSize: 15,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default RegisterScreen;
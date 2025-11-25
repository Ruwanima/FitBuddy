import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from '../styles/theme';
import { THEME_MODE } from '../utils/constants';

const EmptyState = ({ icon = 'inbox', title, message, actionText, onAction, secondaryActionText, onSecondaryAction }) => {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === THEME_MODE.LIGHT ? lightTheme : darkTheme;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous floating animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle rotation animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconRotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(iconRotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
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

  const iconRotate = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.background,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      {/* Decorative background circles */}
      <View style={[styles.decorativeCircle, styles.circle1, { backgroundColor: `${theme.primary}08` }]} />
      <View style={[styles.decorativeCircle, styles.circle2, { backgroundColor: `${theme.secondary}08` }]} />
      <View style={[styles.decorativeCircle, styles.circle3, { backgroundColor: `${theme.primary}05` }]} />

      {/* Animated icon container */}
      <Animated.View 
        style={[
          styles.iconContainer, 
          { 
            backgroundColor: `${theme.primary}10`,
            borderColor: `${theme.primary}20`,
            transform: [
              { translateY: floatAnim },
              { rotate: iconRotate }
            ]
          }
        ]}
      >
        <View style={[styles.iconInnerGlow, { backgroundColor: `${theme.primary}15` }]} />
        <Icon name={icon} size={56} color={theme.primary} />
      </Animated.View>

      {/* Title */}
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

      {/* Message */}
      <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>

      {/* Action buttons */}
      {actionText && onAction && (
        <View style={styles.buttonContainer}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={onAction}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}
            >
              <Text style={styles.buttonText}>{actionText}</Text>
              <Icon name="arrow-right" size={18} color="#FFFFFF" style={styles.buttonIcon} />
            </TouchableOpacity>
          </Animated.View>

          {/* Secondary action button */}
          {secondaryActionText && onSecondaryAction && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, { 
                borderColor: theme.border || `${theme.text}20`,
                backgroundColor: theme.surface || 'transparent'
              }]}
              onPress={onSecondaryAction}
              activeOpacity={0.7}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
                {secondaryActionText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    position: 'relative',
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
  circle3: {
    width: 150,
    height: 150,
    top: '40%',
    right: -50,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  iconInnerGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.5,
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
    maxWidth: 400,
    opacity: 0.85,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
  secondaryButton: {
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmptyState;
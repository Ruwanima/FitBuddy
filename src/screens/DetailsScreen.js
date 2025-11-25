import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import { toggleFavorite } from '../redux/favoritesSlice';
import { fitnessService } from '../services/api';
import { setItem, getItem } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import { lightTheme, darkTheme } from '../styles/theme';
import { THEME_MODE } from '../utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH > 768 ? 400 : Math.min(SCREEN_WIDTH * 0.75, 340);
const IS_LARGE_SCREEN = SCREEN_WIDTH > 768;

const DetailsScreen = ({ route, navigation }) => {
  const { exerciseId } = route.params;
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [scrollY] = useState(new Animated.Value(0));

  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === THEME_MODE.LIGHT ? lightTheme : darkTheme;

  const isFavorite = favorites.some(fav => fav.id === exerciseId);

  useEffect(() => {
    loadExerciseDetails();

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [exerciseId]);

  const loadExerciseDetails = async () => {
    setLoading(true);
    const result = await fitnessService.getExerciseById(exerciseId);

    if (result.success) {
      setExercise(result.data);
    } else {
      Alert.alert('Error', 'Failed to load exercise details.');
      navigation.goBack();
    }
    setLoading(false);
  };

  const handleFavoritePress = async () => {
    console.log('Details: Toggling favorite for:', exercise.title);
    dispatch(toggleFavorite(exercise));
    
    const savedFavorites = await getItem(STORAGE_KEYS.FAVORITES) || [];
    const isCurrentlyFavorite = savedFavorites.some(fav => fav.id === exercise.id);
    
    const updatedFavorites = isCurrentlyFavorite
      ? savedFavorites.filter(fav => fav.id !== exercise.id)
      : [...savedFavorites, exercise];
    
    console.log('Details: Updated favorites count:', updatedFavorites.length);
    const saved = await setItem(STORAGE_KEYS.FAVORITES, updatedFavorites);
    console.log('Details: Favorites saved to storage:', saved);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return '#4CAF50';
      case 'Intermediate':
        return '#FFC107';
      case 'Advanced':
        return '#F44336';
      default:
        return theme.textSecondary;
    }
  };

  const startTimer = () => {
    const durationInSeconds = parseInt(exercise.duration) * 60;
    setRemainingTime(durationInSeconds);
    setTimerRunning(true);
    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          Alert.alert('Workout Complete! 🎉', 'Great job! You finished the exercise.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(interval);
  };

  const pauseTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setTimerRunning(false);
  };

  const resetTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setTimerRunning(false);
    setRemainingTime(0);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWorkout = () => {
    if (!timerRunning && remainingTime === 0) {
      startTimer();
      Alert.alert('Workout Started!', `Get ready for ${exercise.duration} minutes of exercise!`);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading details..." />;
  }

  if (!exercise) {
    return null;
  }

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[
        styles.animatedHeader,
        { 
          backgroundColor: theme.card,
          opacity: headerOpacity,
        }
      ]}>
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
          {exercise.title}
        </Text>
      </Animated.View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: exercise.image }}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.imageGradient} />
          
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.favoriteButton, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}
            onPress={handleFavoritePress}
          >
            <Icon
              name={isFavorite ? "heart" : "heart"}
              size={24}
              color={isFavorite ? '#FF6B6B' : '#FFFFFF'}
              fill={isFavorite ? '#FF6B6B' : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.content, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: theme.text }]}>{exercise.title}</Text>
              <View style={styles.ratingPill}>
                <Icon name="star" size={16} color="#FFB800" />
                <Text style={styles.ratingText}>
                  {exercise.rating?.toFixed(1) || '4.5'}
                </Text>
              </View>
            </View>
            
            <View style={[styles.statusBadge, { backgroundColor: `${theme.primary}15` }]}>
              <View style={[styles.statusDot, { backgroundColor: theme.primary }]} />
              <Text style={[styles.statusText, { color: theme.primary }]}>
                {exercise.status}
              </Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { 
              backgroundColor: theme.surface,
              shadowColor: theme.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }]}>
              <View style={[styles.statIconContainer, { backgroundColor: `${theme.primary}15` }]}>
                <Icon name="clock" size={22} color={theme.primary} />
              </View>
              <Text style={[styles.statValue, { color: theme.text }]}>{exercise.duration}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Minutes</Text>
            </View>

            <View style={[styles.statCard, { 
              backgroundColor: theme.surface,
              shadowColor: theme.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }]}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FFB80015' }]}>
                <Icon name="zap" size={22} color="#FFB800" />
              </View>
              <Text style={[styles.statValue, { color: theme.text }]}>{exercise.calories}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Calories</Text>
            </View>

            <View style={[styles.statCard, { 
              backgroundColor: theme.surface,
              shadowColor: theme.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }]}>
              <View style={[styles.difficultyIcon, { backgroundColor: `${getDifficultyColor(exercise.difficulty)}15` }]}>
                <View style={[styles.difficultyDot, { backgroundColor: getDifficultyColor(exercise.difficulty) }]} />
              </View>
              <Text style={[styles.statValue, { color: theme.text, fontSize: 13 }]}>
                {exercise.difficulty}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Level</Text>
            </View>
          </View>

          <View style={[styles.section, { 
            backgroundColor: theme.surface,
            borderRadius: 16,
            padding: 20,
            shadowColor: theme.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: `${theme.primary}15` }]}>
                <Icon name="info" size={18} color={theme.primary} />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>About this workout</Text>
            </View>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {exercise.description}
            </Text>
          </View>

          {exercise.benefits && exercise.benefits.length > 0 && (
            <View style={[styles.section, { 
              backgroundColor: theme.surface,
              borderRadius: 16,
              padding: 20,
              shadowColor: theme.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconContainer, { backgroundColor: '#4CAF5015' }]}>
                  <Icon name="check-circle" size={18} color="#4CAF50" />
                </View>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Key Benefits</Text>
              </View>
              {exercise.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <View style={styles.benefitIconContainer}>
                    <Icon name="check" size={14} color="#4CAF50" />
                  </View>
                  <Text style={[styles.benefitText, { color: theme.text }]}>{benefit}</Text>
                </View>
              ))}
            </View>
          )}

          {exercise.equipment && exercise.equipment.length > 0 && (
            <View style={[styles.section, { 
              backgroundColor: theme.surface,
              borderRadius: 16,
              padding: 20,
              shadowColor: theme.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconContainer, { backgroundColor: `${theme.primary}15` }]}>
                  <Icon name="package" size={18} color={theme.primary} />
                </View>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Equipment Needed</Text>
              </View>
              <View style={styles.equipmentContainer}>
                {exercise.equipment.map((item, index) => (
                  <View key={index} style={[styles.equipmentBadge, { 
                    backgroundColor: theme.background,
                    borderWidth: 1.5,
                    borderColor: theme.primary + '30',
                  }]}>
                    <Icon name="check-circle" size={14} color={theme.primary} />
                    <Text style={[styles.equipmentText, { color: theme.text }]}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={[styles.categoryContainer, { 
            backgroundColor: `${theme.primary}10`,
            borderRadius: 12,
            padding: 16,
          }]}>
            <Icon name="activity" size={20} color={theme.primary} />
            <Text style={[styles.categoryText, { color: theme.primary }]}>
              {exercise.category}
            </Text>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {(timerRunning || remainingTime > 0) && (
        <View style={[styles.timerBar, { 
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        }]}>
          <View style={styles.timerDisplay}>
            <View style={[styles.timerIconContainer, { 
              backgroundColor: remainingTime < 60 ? '#FF453A15' : `${theme.primary}15` 
            }]}>
              <Icon name="clock" size={20} color={remainingTime < 60 ? '#FF453A' : theme.primary} />
            </View>
            <Text style={[styles.timerText, { color: remainingTime < 60 ? '#FF453A' : theme.text }]}>
              {formatTime(remainingTime)}
            </Text>
          </View>
          <View style={styles.timerControls}>
            <TouchableOpacity
              style={[styles.timerControlButton, { 
                backgroundColor: timerRunning ? '#FFB800' : theme.primary 
              }]}
              onPress={timerRunning ? pauseTimer : startTimer}
              activeOpacity={0.8}
            >
              <Icon name={timerRunning ? "pause" : "play"} size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timerControlButton, { backgroundColor: '#FF453A' }]}
              onPress={resetTimer}
              activeOpacity={0.8}
            >
              <Icon name="square" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={[styles.footer, { 
        backgroundColor: theme.background,
        borderTopWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
      }]}>
        {!timerRunning && remainingTime === 0 ? (
          <View style={styles.footerButtons}>
            <TouchableOpacity
              style={[styles.favoriteActionButton, { 
                backgroundColor: isFavorite ? theme.surface : theme.card,
                borderWidth: 2,
                borderColor: isFavorite ? '#FF6B6B' : theme.border,
                shadowColor: isFavorite ? '#FF6B6B' : theme.border,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }]}
              onPress={handleFavoritePress}
              activeOpacity={0.8}
            >
              <Icon 
                name={isFavorite ? "heart" : "heart"} 
                size={20} 
                color={isFavorite ? '#FF6B6B' : theme.icon}
                fill={isFavorite ? '#FF6B6B' : 'transparent'}
              />
              <Text style={[styles.favoriteActionButtonText, { 
                color: isFavorite ? '#FF6B6B' : theme.text 
              }]}>
                {isFavorite ? 'Favorited' : 'Add Favorite'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { 
                backgroundColor: theme.primary,
                shadowColor: theme.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 6,
              }]}
              onPress={handleStartWorkout}
              activeOpacity={0.9}
            >
              <View style={styles.playIconContainer}>
                <Icon name="play" size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.actionButtonText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.workoutActive, { 
            backgroundColor: theme.surface,
            borderRadius: 16,
            padding: 16,
          }]}>
            <View style={[styles.pulseContainer, { backgroundColor: `${theme.primary}15` }]}>
              <Icon name="activity" size={24} color={theme.primary} />
            </View>
            <Text style={[styles.workoutActiveText, { color: theme.text }]}>Workout in Progress</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 10,
    justifyContent: 'flex-end',
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    minHeight: 250,
    maxHeight: 500,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  content: {
    padding: IS_LARGE_SCREEN ? 32 : 20,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxWidth: IS_LARGE_SCREEN ? 800 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: IS_LARGE_SCREEN ? 28 : 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: IS_LARGE_SCREEN ? 34 : 30,
    fontWeight: '800',
    flex: 1,
    marginRight: 12,
    letterSpacing: -0.5,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFB80020',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFB800',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: IS_LARGE_SCREEN ? 28 : 24,
    gap: IS_LARGE_SCREEN ? 16 : 12,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: IS_LARGE_SCREEN ? 160 : 0,
    alignItems: 'center',
    padding: IS_LARGE_SCREEN ? 22 : 18,
    borderRadius: 16,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  difficultyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: IS_LARGE_SCREEN ? 24 : 22,
    fontWeight: '800',
    marginTop: 4,
  },
  statLabel: {
    fontSize: IS_LARGE_SCREEN ? 13 : 12,
    marginTop: 4,
    fontWeight: '500',
  },
  difficultyDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: IS_LARGE_SCREEN ? 21 : 19,
    fontWeight: '700',
  },
  description: {
    fontSize: IS_LARGE_SCREEN ? 17 : 16,
    lineHeight: IS_LARGE_SCREEN ? 28 : 26,
    fontWeight: '400',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 12,
  },
  benefitIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF5015',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  benefitText: {
    fontSize: IS_LARGE_SCREEN ? 16 : 15,
    flex: 1,
    lineHeight: IS_LARGE_SCREEN ? 26 : 24,
    fontWeight: '400',
  },
  equipmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  equipmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  equipmentText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
    maxWidth: IS_LARGE_SCREEN ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  favoriteActionButton: {
    flexDirection: 'row',
    height: IS_LARGE_SCREEN ? 66 : 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    minWidth: 110,
  },
  favoriteActionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  timerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: IS_LARGE_SCREEN ? 32 : 28,
    fontWeight: '800',
    letterSpacing: 1,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 10,
  },
  timerControlButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButton: {
    flexDirection: 'row',
    height: IS_LARGE_SCREEN ? 66 : 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  playIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: IS_LARGE_SCREEN ? 20 : 19,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  workoutActive: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  pulseContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutActiveText: {
    fontSize: 18,
    fontWeight: '800',
  },
});

export default DetailsScreen;
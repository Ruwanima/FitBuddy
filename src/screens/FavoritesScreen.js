import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_LARGE_SCREEN = SCREEN_WIDTH > 768;
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import { setSelectedExercise } from '../redux/exerciseSlice';
import { toggleFavorite, clearFavorites } from '../redux/favoritesSlice';
import { setItem } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import ExerciseCard from '../components/ExerciseCard';
import EmptyState from '../components/EmptyState';
import { lightTheme, darkTheme } from '../styles/theme';
import { THEME_MODE } from '../utils/constants';

// Custom fitness images array - same as in api.js
const customExerciseImages = [
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500', // Running
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500', // HIIT
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', // Yoga
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500', // Strength
  'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=500', // Cycling
  'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=500', // Swimming
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500', // Pilates
  'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500', // Boxing
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500', // Dance
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500', // CrossFit
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500', // Stretching
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', // Abs
  'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=500', // Leg Day
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500', // Upper Body
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500', // Walk
  'https://images.unsplash.com/photo-1518644730709-0835105d9daa?w=500', // Jump Rope
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500', // Kettlebell
  'https://images.unsplash.com/photo-1550259979-ed79b48d2a30?w=500', // Bodyweight
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500', // Meditation
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500', // Sports
];

const FavoritesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === THEME_MODE.LIGHT ? lightTheme : darkTheme;
  const [scrollY] = useState(new Animated.Value(0));

  // Update exercise images with current URLs
  const getUpdatedExercise = (exercise) => {
    const imageIndex = (exercise.id - 1) % customExerciseImages.length;
    return {
      ...exercise,
      image: customExerciseImages[imageIndex],
    };
  };

  const handleExercisePress = async (exercise) => {
    const updatedExercise = getUpdatedExercise(exercise);
    dispatch(setSelectedExercise(updatedExercise));
    navigation.navigate('Details', { exerciseId: exercise.id });
  };

  const handleFavoritePress = async (exercise) => {
    dispatch(toggleFavorite(exercise));
    
    const updatedFavorites = favorites.filter(fav => fav.id !== exercise.id);
    await setItem(STORAGE_KEYS.FAVORITES, updatedFavorites);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all favorites? This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            dispatch(clearFavorites());
            await setItem(STORAGE_KEYS.FAVORITES, []);
          },
        },
      ]
    );
  };

  const isFavorite = (exerciseId) => {
    return favorites.some(fav => fav.id === exerciseId);
  };

  const getTotalCalories = () => {
    return favorites.reduce((sum, exercise) => {
      const calories = parseInt(exercise.calories) || 0;
      return sum + calories;
    }, 0);
  };

  const getTotalDuration = () => {
    return favorites.reduce((sum, exercise) => {
      const duration = parseInt(exercise.duration) || 0;
      return sum + duration;
    }, 0);
  };

  const getDifficultyBreakdown = () => {
    const breakdown = { Beginner: 0, Intermediate: 0, Advanced: 0 };
    favorites.forEach(exercise => {
      if (breakdown.hasOwnProperty(exercise.difficulty)) {
        breakdown[exercise.difficulty]++;
      }
    });
    return breakdown;
  };

  const renderHeader = () => {
    if (favorites.length === 0) return null;

    const headerOpacity = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0.9],
      extrapolate: 'clamp',
    });

    const totalCalories = getTotalCalories();
    const totalDuration = getTotalDuration();
    const difficultyBreakdown = getDifficultyBreakdown();

    return (
      <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
        <View style={styles.titleSection}>
          <View style={[styles.iconContainer, { backgroundColor: '#FF6B6B15' }]}>
            <Icon name="heart" size={28} color="#FF6B6B" />
          </View>
          <View style={styles.titleTextContainer}>
            <Text style={[styles.title, { color: theme.text }]}>Your Favorites</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {favorites.length} {favorites.length === 1 ? 'workout' : 'workouts'} saved
            </Text>
          </View>
          {favorites.length > 0 && (
            <TouchableOpacity
              style={[styles.clearButton, { 
                backgroundColor: '#FF6B6B15',
                borderWidth: 1,
                borderColor: '#FF6B6B30',
              }]}
              onPress={handleClearAll}
              activeOpacity={0.7}
            >
              <Icon name="trash-2" size={18} color="#FF6B6B" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { 
            backgroundColor: theme.surface,
            shadowColor: theme.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }]}>
            <View style={[styles.statIconCircle, { backgroundColor: `${theme.primary}15` }]}>
              <Icon name="clock" size={20} color={theme.primary} />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {totalDuration}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Total Minutes
              </Text>
            </View>
          </View>

          <View style={[styles.statCard, { 
            backgroundColor: theme.surface,
            shadowColor: theme.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }]}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FFB80015' }]}>
              <Icon name="zap" size={20} color="#FFB800" />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {totalCalories}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Total Calories
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.difficultySection, { 
          backgroundColor: theme.surface,
          borderRadius: 16,
          padding: 16,
          shadowColor: theme.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }]}>
          <View style={styles.difficultySectionHeader}>
            <Icon name="bar-chart-2" size={18} color={theme.primary} />
            <Text style={[styles.difficultySectionTitle, { color: theme.text }]}>
              Difficulty Distribution
            </Text>
          </View>
          <View style={styles.difficultyBars}>
            {difficultyBreakdown.Beginner > 0 && (
              <View style={styles.difficultyRow}>
                <View style={styles.difficultyLabel}>
                  <View style={[styles.difficultyDot, { backgroundColor: '#4CAF50' }]} />
                  <Text style={[styles.difficultyText, { color: theme.text }]}>
                    Beginner
                  </Text>
                </View>
                <View style={styles.difficultyBarContainer}>
                  <View 
                    style={[
                      styles.difficultyBar, 
                      { 
                        backgroundColor: '#4CAF5025',
                        width: `${(difficultyBreakdown.Beginner / favorites.length) * 100}%`,
                      }
                    ]} 
                  />
                  <Text style={[styles.difficultyCount, { color: theme.text }]}>
                    {difficultyBreakdown.Beginner}
                  </Text>
                </View>
              </View>
            )}
            {difficultyBreakdown.Intermediate > 0 && (
              <View style={styles.difficultyRow}>
                <View style={styles.difficultyLabel}>
                  <View style={[styles.difficultyDot, { backgroundColor: '#FFB800' }]} />
                  <Text style={[styles.difficultyText, { color: theme.text }]}>
                    Intermediate
                  </Text>
                </View>
                <View style={styles.difficultyBarContainer}>
                  <View 
                    style={[
                      styles.difficultyBar, 
                      { 
                        backgroundColor: '#FFB80025',
                        width: `${(difficultyBreakdown.Intermediate / favorites.length) * 100}%`,
                      }
                    ]} 
                  />
                  <Text style={[styles.difficultyCount, { color: theme.text }]}>
                    {difficultyBreakdown.Intermediate}
                  </Text>
                </View>
              </View>
            )}
            {difficultyBreakdown.Advanced > 0 && (
              <View style={styles.difficultyRow}>
                <View style={styles.difficultyLabel}>
                  <View style={[styles.difficultyDot, { backgroundColor: '#FF453A' }]} />
                  <Text style={[styles.difficultyText, { color: theme.text }]}>
                    Advanced
                  </Text>
                </View>
                <View style={styles.difficultyBarContainer}>
                  <View 
                    style={[
                      styles.difficultyBar, 
                      { 
                        backgroundColor: '#FF453A25',
                        width: `${(difficultyBreakdown.Advanced / favorites.length) * 100}%`,
                      }
                    ]} 
                  />
                  <Text style={[styles.difficultyCount, { color: theme.text }]}>
                    {difficultyBreakdown.Advanced}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.sectionDivider}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            All Favorites
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderExerciseCard = ({ item, index }) => {
    const inputRange = [
      -1,
      0,
      index * 100,
      (index + 2) * 100,
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.95],
      extrapolate: 'clamp',
    });

    // Update exercise with current image URL
    const updatedExercise = getUpdatedExercise(item);

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <ExerciseCard
          exercise={updatedExercise}
          onPress={() => handleExercisePress(item)}
          onFavoritePress={() => handleFavoritePress(item)}
          isFavorite={isFavorite(item.id)}
        />
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={themeMode === THEME_MODE.LIGHT ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
      />
      
      <FlatList
        data={favorites}
        renderItem={renderExerciseCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="heart"
            title="No Favorites Yet"
            message="Start adding exercises to your favorites to see them here. Tap the heart icon on any exercise to save it."
            actionText="Explore Exercises"
            onAction={() => navigation.navigate('Home')}
          />
        }
        contentContainerStyle={favorites.length === 0 ? styles.emptyContainer : styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: IS_LARGE_SCREEN ? 32 : 20,
    paddingTop: IS_LARGE_SCREEN ? 24 : 16,
    maxWidth: IS_LARGE_SCREEN ? 1200 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: IS_LARGE_SCREEN ? 28 : 24,
    gap: IS_LARGE_SCREEN ? 20 : 16,
  },
  iconContainer: {
    width: IS_LARGE_SCREEN ? 64 : 56,
    height: IS_LARGE_SCREEN ? 64 : 56,
    borderRadius: IS_LARGE_SCREEN ? 32 : 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTextContainer: {
    flex: 1,
  },
  clearButton: {
    width: IS_LARGE_SCREEN ? 48 : 44,
    height: IS_LARGE_SCREEN ? 48 : 44,
    borderRadius: IS_LARGE_SCREEN ? 24 : 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: IS_LARGE_SCREEN ? 32 : 28,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: IS_LARGE_SCREEN ? 16 : 15,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: IS_LARGE_SCREEN ? 16 : 12,
    marginBottom: IS_LARGE_SCREEN ? 20 : 16,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: IS_LARGE_SCREEN ? 160 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: IS_LARGE_SCREEN ? 20 : 16,
    borderRadius: 16,
    gap: 12,
  },
  statIconCircle: {
    width: IS_LARGE_SCREEN ? 48 : 44,
    height: IS_LARGE_SCREEN ? 48 : 44,
    borderRadius: IS_LARGE_SCREEN ? 24 : 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  difficultySection: {
    marginBottom: 24,
  },
  difficultySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  difficultySectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  difficultyBars: {
    gap: 12,
  },
  difficultyRow: {
    gap: 8,
  },
  difficultyLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  difficultyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  difficultyBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  difficultyBar: {
    height: 8,
    borderRadius: 4,
    minWidth: 40,
  },
  difficultyCount: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 20,
  },
  sectionDivider: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
  },
});

export default FavoritesScreen;
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  TextInput,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_LARGE_SCREEN = SCREEN_WIDTH > 768;
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import {
  fetchExercisesStart,
  fetchExercisesSuccess,
  fetchExercisesFailure,
  setSelectedExercise,
} from '../redux/exerciseSlice';
import { toggleFavorite, setFavorites } from '../redux/favoritesSlice';
import { fitnessService } from '../services/api';
import { getItem, setItem } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import ExerciseCard from '../components/ExerciseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { lightTheme, darkTheme } from '../styles/theme';
import { THEME_MODE } from '../utils/constants';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { exercises, loading } = useSelector((state) => state.exercise);
  const { favorites } = useSelector((state) => state.favorites);
  const { user } = useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === THEME_MODE.LIGHT ? lightTheme : darkTheme;

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [scrollY] = useState(new Animated.Value(0));

  useEffect(() => {
    loadExercises();
    loadFavorites();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredExercises(exercises);
    } else {
      const filtered = exercises.filter(exercise =>
        exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExercises(filtered);
    }
  }, [searchQuery, exercises]);

  const loadExercises = async () => {
    dispatch(fetchExercisesStart());
    const result = await fitnessService.getExercises(30);

    if (result.success) {
      dispatch(fetchExercisesSuccess(result.data));
    } else {
      dispatch(fetchExercisesFailure(result.error));
      Alert.alert('Error', 'Failed to load exercises. Please try again.');
    }
  };

  const loadFavorites = async () => {
    const savedFavorites = await getItem(STORAGE_KEYS.FAVORITES);
    if (savedFavorites) {
      dispatch(setFavorites(savedFavorites));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExercises();
    setRefreshing(false);
  };

  const handleExercisePress = async (exercise) => {
    dispatch(setSelectedExercise(exercise));
    navigation.navigate('Details', { exerciseId: exercise.id });
  };

  const handleFavoritePress = async (exercise) => {
    console.log('Toggling favorite for:', exercise.title);
    dispatch(toggleFavorite(exercise));
    
    // Read from storage to ensure we have the latest data
    const savedFavorites = await getItem(STORAGE_KEYS.FAVORITES) || [];
    const isCurrentlyFavorite = savedFavorites.some(fav => fav.id === exercise.id);
    
    const updatedFavorites = isCurrentlyFavorite
      ? savedFavorites.filter(fav => fav.id !== exercise.id)
      : [...savedFavorites, exercise];
    
    console.log('Updated favorites count:', updatedFavorites.length);
    const saved = await setItem(STORAGE_KEYS.FAVORITES, updatedFavorites);
    console.log('Favorites saved to storage:', saved);
  };

  const isFavorite = (exerciseId) => {
    return favorites.some(fav => fav.id === exerciseId);
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const renderHeader = () => {
    const headerOpacity = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0.8],
      extrapolate: 'clamp',
    });

    const headerTranslateY = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [0, -10],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View 
        style={[
          styles.headerContainer,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          }
        ]}
      >
        <View style={styles.greetingSection}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>
              {getTimeOfDayGreeting()}
            </Text>
            <Text style={[styles.userName, { color: theme.text }]}>
              {user?.firstName || user?.username || 'Fitness Enthusiast'}! 👋
            </Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={[styles.miniStatCard, { backgroundColor: `${theme.primary}15` }]}>
              <Icon name="activity" size={18} color={theme.primary} />
              <Text style={[styles.miniStatNumber, { color: theme.text }]}>
                {filteredExercises.length}
              </Text>
              <Text style={[styles.miniStatLabel, { color: theme.textSecondary }]}>
                Workouts
              </Text>
            </View>
            
            <View style={[styles.miniStatCard, { backgroundColor: '#FF6B6B15' }]}>
              <Icon name="heart" size={18} color="#FF6B6B" />
              <Text style={[styles.miniStatNumber, { color: theme.text }]}>
                {favorites.length}
              </Text>
              <Text style={[styles.miniStatLabel, { color: theme.textSecondary }]}>
                Favorites
              </Text>
            </View>
          </View>
        </View>
        
        <View style={[
          styles.searchContainer, 
          { 
            backgroundColor: theme.card, 
            borderColor: theme.border,
            shadowColor: theme.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }
        ]}>
          <View style={[styles.searchIconContainer, { backgroundColor: `${theme.primary}15` }]}>
            <Icon name="search" size={18} color={theme.primary} />
          </View>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search exercises, categories..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')} 
              style={[styles.clearButton, { backgroundColor: theme.background }]}
              activeOpacity={0.7}
            >
              <Icon name="x" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {searchQuery.length > 0 && (
          <View style={styles.searchResultsHeader}>
            <Text style={[styles.searchResultsText, { color: theme.textSecondary }]}>
              Found {filteredExercises.length} {filteredExercises.length === 1 ? 'result' : 'results'}
            </Text>
          </View>
        )}
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

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <ExerciseCard
          exercise={item}
          onPress={() => handleExercisePress(item)}
          onFavoritePress={() => handleFavoritePress(item)}
          isFavorite={isFavorite(item.id)}
        />
      </Animated.View>
    );
  };

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading exercises..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={themeMode === THEME_MODE.LIGHT ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
      />
      
      <FlatList
        data={filteredExercises}
        renderItem={renderExerciseCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="activity"
            title={searchQuery ? "No Matches Found" : "No Exercises Found"}
            message={searchQuery ? `No exercises match "${searchQuery}". Try a different search.` : "We couldn't load any exercises. Please check your connection and try again."}
            actionText={searchQuery ? "Clear Search" : "Retry"}
            onAction={searchQuery ? () => setSearchQuery('') : loadExercises}
          />
        }
        contentContainerStyle={filteredExercises.length === 0 ? styles.emptyContainer : styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
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
    paddingBottom: IS_LARGE_SCREEN ? 16 : 12,
    maxWidth: IS_LARGE_SCREEN ? 1200 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  greetingSection: {
    marginBottom: IS_LARGE_SCREEN ? 24 : 20,
  },
  greeting: {
    fontSize: IS_LARGE_SCREEN ? 16 : 15,
    marginBottom: 6,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  userName: {
    fontSize: IS_LARGE_SCREEN ? 36 : 32,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: IS_LARGE_SCREEN ? 16 : 12,
    flexWrap: 'wrap',
  },
  miniStatCard: {
    flex: 1,
    minWidth: IS_LARGE_SCREEN ? 160 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: IS_LARGE_SCREEN ? 16 : 12,
    borderRadius: 12,
    gap: 8,
  },
  miniStatNumber: {
    fontSize: IS_LARGE_SCREEN ? 20 : 18,
    fontWeight: '800',
  },
  miniStatLabel: {
    fontSize: IS_LARGE_SCREEN ? 13 : 12,
    fontWeight: '600',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: IS_LARGE_SCREEN ? 18 : 14,
    paddingVertical: IS_LARGE_SCREEN ? 14 : 12,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  searchIconContainer: {
    width: IS_LARGE_SCREEN ? 40 : 36,
    height: IS_LARGE_SCREEN ? 40 : 36,
    borderRadius: IS_LARGE_SCREEN ? 20 : 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: IS_LARGE_SCREEN ? 17 : 16,
    fontWeight: '500',
    paddingVertical: 4,
  },
  clearButton: {
    width: IS_LARGE_SCREEN ? 32 : 28,
    height: IS_LARGE_SCREEN ? 32 : 28,
    borderRadius: IS_LARGE_SCREEN ? 16 : 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  searchResultsHeader: {
    marginTop: 12,
    paddingVertical: 8,
  },
  searchResultsText: {
    fontSize: IS_LARGE_SCREEN ? 15 : 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
  },
});

export default HomeScreen;
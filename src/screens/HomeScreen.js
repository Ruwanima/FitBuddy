import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
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

  useEffect(() => {
    loadExercises();
    loadFavorites();
  }, []);

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
    dispatch(toggleFavorite(exercise));
    
    // Save to storage
    const currentFavorites = favorites.find(fav => fav.id === exercise.id)
      ? favorites.filter(fav => fav.id !== exercise.id)
      : [...favorites, exercise];
    
    await setItem(STORAGE_KEYS.FAVORITES, currentFavorites);
  };

  const isFavorite = (exerciseId) => {
    return favorites.some(fav => fav.id === exerciseId);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View>
        <Text style={[styles.greeting, { color: theme.textSecondary }]}>Welcome back,</Text>
        <Text style={[styles.userName, { color: theme.text }]}>
          {user?.firstName || user?.username || 'Fitness Enthusiast'}! 👋
        </Text>
      </View>
    </View>
  );

  const renderExerciseCard = ({ item }) => (
    <ExerciseCard
      exercise={item}
      onPress={() => handleExercisePress(item)}
      onFavoritePress={() => handleFavoritePress(item)}
      isFavorite={isFavorite(item.id)}
    />
  );

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading exercises..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={exercises}
        renderItem={renderExerciseCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="activity"
            title="No Exercises Found"
            message="We couldn't load any exercises. Please check your connection and try again."
            actionText="Retry"
            onAction={loadExercises}
          />
        }
        contentContainerStyle={exercises.length === 0 ? styles.emptyContainer : styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
  },
});

export default HomeScreen;

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedExercise } from '../redux/exerciseSlice';
import { toggleFavorite } from '../redux/favoritesSlice';
import { setItem } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import ExerciseCard from '../components/ExerciseCard';
import EmptyState from '../components/EmptyState';
import { lightTheme, darkTheme } from '../styles/theme';
import { THEME_MODE } from '../utils/constants';

const FavoritesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === THEME_MODE.LIGHT ? lightTheme : darkTheme;

  const handleExercisePress = async (exercise) => {
    dispatch(setSelectedExercise(exercise));
    navigation.navigate('Details', { exerciseId: exercise.id });
  };

  const handleFavoritePress = async (exercise) => {
    dispatch(toggleFavorite(exercise));
    
    const updatedFavorites = favorites.filter(fav => fav.id !== exercise.id);
    await setItem(STORAGE_KEYS.FAVORITES, updatedFavorites);
  };

  const isFavorite = (exerciseId) => {
    return favorites.some(fav => fav.id === exerciseId);
  };

  const renderExerciseCard = ({ item }) => (
    <ExerciseCard
      exercise={item}
      onPress={() => handleExercisePress(item)}
      onFavoritePress={() => handleFavoritePress(item)}
      isFavorite={isFavorite(item.id)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={favorites}
        renderItem={renderExerciseCard}
        keyExtractor={(item) => item.id.toString()}
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 12,
  },
  emptyContainer: {
    flex: 1,
  },
});

export default FavoritesScreen;

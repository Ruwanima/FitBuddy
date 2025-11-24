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

const { width } = Dimensions.get('window');

const DetailsScreen = ({ route, navigation }) => {
  const { exerciseId } = route.params;
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === THEME_MODE.LIGHT ? lightTheme : darkTheme;

  const isFavorite = favorites.some(fav => fav.id === exerciseId);

  useEffect(() => {
    loadExerciseDetails();
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
    dispatch(toggleFavorite(exercise));
    
    const savedFavorites = await getItem(STORAGE_KEYS.FAVORITES) || [];
    const isCurrentlyFavorite = savedFavorites.some(fav => fav.id === exercise.id);
    
    const updatedFavorites = isCurrentlyFavorite
      ? savedFavorites.filter(fav => fav.id !== exercise.id)
      : [...savedFavorites, exercise];
    
    await setItem(STORAGE_KEYS.FAVORITES, updatedFavorites);
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

  if (loading) {
    return <LoadingSpinner message="Loading details..." />;
  }

  if (!exercise) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: exercise.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: themeMode === THEME_MODE.LIGHT ? 'rgba(255, 255, 255, 0.95)' : 'rgba(18, 18, 18, 0.95)' }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.favoriteButton, { backgroundColor: themeMode === THEME_MODE.LIGHT ? 'rgba(255, 255, 255, 0.95)' : 'rgba(18, 18, 18, 0.95)' }]}
            onPress={handleFavoritePress}
          >
            <Icon
              name="heart"
              size={24}
              color={isFavorite ? '#FF6B6B' : theme.icon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: theme.text }]}>{exercise.title}</Text>
              <View style={styles.statusBadge}>
                <Text style={[styles.statusText, { color: theme.primary }]}>
                  {exercise.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color="#FFC107" />
              <Text style={[styles.ratingText, { color: theme.text }]}>
                {exercise.rating?.toFixed(1) || '4.5'}
              </Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
              <Icon name="clock" size={24} color={theme.primary} />
              <Text style={[styles.statValue, { color: theme.text }]}>{exercise.duration}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Minutes</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
              <Icon name="zap" size={24} color="#FFC107" />
              <Text style={[styles.statValue, { color: theme.text }]}>{exercise.calories}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Calories</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
              <View style={[styles.difficultyDot, { backgroundColor: getDifficultyColor(exercise.difficulty) }]} />
              <Text style={[styles.statValue, { color: theme.text, fontSize: 14 }]}>
                {exercise.difficulty}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Level</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="info" size={20} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
            </View>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {exercise.description}
            </Text>
          </View>

          {exercise.benefits && exercise.benefits.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="check-circle" size={20} color={theme.secondary} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Benefits</Text>
              </View>
              {exercise.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Icon name="check" size={16} color={theme.success} />
                  <Text style={[styles.benefitText, { color: theme.text }]}>{benefit}</Text>
                </View>
              ))}
            </View>
          )}

          {exercise.equipment && exercise.equipment.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="package" size={20} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Equipment Needed</Text>
              </View>
              <View style={styles.equipmentContainer}>
                {exercise.equipment.map((item, index) => (
                  <View key={index} style={[styles.equipmentBadge, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.equipmentText, { color: theme.text }]}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.categorySection}>
            <View style={[styles.categoryBadge, { backgroundColor: theme.primary + '33' }]}>
              <Icon name="activity" size={18} color={theme.primary} />
              <Text style={[styles.categoryText, { color: theme.primary }]}>
                {exercise.category}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={() => Alert.alert('Start Workout', 'Workout feature coming soon!')}
        >
          <Icon name="play" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
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
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  difficultyDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  benefitText: {
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },
  equipmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  equipmentText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categorySection: {
    alignItems: 'center',
    marginTop: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DetailsScreen;

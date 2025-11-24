import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from '../styles/theme';
import { THEME_MODE } from '../utils/constants';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

const ExerciseCard = ({ exercise, onPress, onFavoritePress, isFavorite }) => {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === THEME_MODE.LIGHT ? lightTheme : darkTheme;

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Popular':
        return '#FF6B6B';
      case 'Trending':
        return '#4ECDC4';
      case 'New':
        return '#95E1D3';
      default:
        return theme.secondary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: exercise.image }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <TouchableOpacity
        style={[styles.favoriteButton, { backgroundColor: theme.background }]}
        onPress={(e) => {
          e.stopPropagation();
          onFavoritePress();
        }}
      >
        <Icon
          name="heart"
          size={20}
          color={isFavorite ? '#FF6B6B' : theme.icon}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {exercise.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(exercise.status) }]}>
            <Text style={styles.statusText}>{exercise.status}</Text>
          </View>
        </View>

        <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
          {exercise.description}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Icon name="activity" size={16} color={theme.primary} />
            <Text style={[styles.detailText, { color: theme.text }]}>
              {exercise.category}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Icon name="clock" size={16} color={theme.secondary} />
            <Text style={[styles.detailText, { color: theme.text }]}>
              {exercise.duration} min
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Icon name="zap" size={16} color="#FFC107" />
            <Text style={[styles.detailText, { color: theme.text }]}>
              {exercise.calories} cal
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) + '33' }]}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor(exercise.difficulty) }]}>
              {exercise.difficulty}
            </Text>
          </View>

          <View style={styles.rating}>
            <Icon name="star" size={16} color="#FFC107" />
            <Text style={[styles.ratingText, { color: theme.text }]}>
              {exercise.rating?.toFixed(1) || '4.5'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#E0E0E0',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ExerciseCard;

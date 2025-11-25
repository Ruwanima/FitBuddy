import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from '../styles/theme';
import { THEME_MODE } from '../utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH > 768 ? 400 : SCREEN_WIDTH - 32;
const IMAGE_HEIGHT = SCREEN_WIDTH > 768 ? 250 : SCREEN_WIDTH * 0.5;

const ExerciseCard = ({ exercise, onPress, onFavoritePress, isFavorite }) => {
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === THEME_MODE.LIGHT ? lightTheme : darkTheme;
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const favoriteAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleFavoritePress = () => {
    Animated.sequence([
      Animated.timing(favoriteAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(favoriteAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    onFavoritePress();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return '#4CAF50';
      case 'Intermediate':
        return '#FFA726';
      case 'Advanced':
        return '#EF5350';
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
        return '#A78BFA';
      default:
        return theme.secondary;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Image with gradient overlay */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: exercise.image }}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.imageGradient} />
          
          {/* Status badge on image */}
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(exercise.status) }]}>
            <Text style={styles.statusText}>{exercise.status}</Text>
          </View>
        </View>
        
        {/* Animated favorite button */}
        <Animated.View style={{ transform: [{ scale: favoriteAnim }] }}>
          <TouchableOpacity
            style={[styles.favoriteButton, { 
              backgroundColor: isFavorite ? '#FFE5E5' : theme.background,
              borderWidth: isFavorite ? 0 : 1,
              borderColor: theme.border || 'rgba(0,0,0,0.1)'
            }]}
            onPress={(e) => {
              e.stopPropagation();
              handleFavoritePress();
            }}
          >
            <Icon
              name={isFavorite ? "heart" : "heart"}
              size={20}
              color={isFavorite ? '#FF6B6B' : theme.icon}
              fill={isFavorite ? '#FF6B6B' : 'transparent'}
            />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.content}>
          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {exercise.title}
          </Text>

          {/* Description */}
          <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
            {exercise.description}
          </Text>

          {/* Details with icons */}
          <View style={styles.details}>
            <View style={[styles.detailItem, { backgroundColor: theme.background || '#F5F5F5' }]}>
              <Icon name="activity" size={14} color={theme.primary} />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {exercise.category}
              </Text>
            </View>

            <View style={[styles.detailItem, { backgroundColor: theme.background || '#F5F5F5' }]}>
              <Icon name="clock" size={14} color="#9C27B0" />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {exercise.duration}m
              </Text>
            </View>

            <View style={[styles.detailItem, { backgroundColor: theme.background || '#F5F5F5' }]}>
              <Icon name="zap" size={14} color="#FF9800" />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {exercise.calories}
              </Text>
            </View>
          </View>

          {/* Footer with difficulty and rating */}
          <View style={styles.footer}>
            <View style={[styles.difficultyBadge, { 
              backgroundColor: `${getDifficultyColor(exercise.difficulty)}15`,
              borderWidth: 1,
              borderColor: `${getDifficultyColor(exercise.difficulty)}30`
            }]}>
              <View style={[styles.difficultyDot, { backgroundColor: getDifficultyColor(exercise.difficulty) }]} />
              <Text style={[styles.difficultyText, { color: getDifficultyColor(exercise.difficulty) }]}>
                {exercise.difficulty}
              </Text>
            </View>

            <View style={styles.rating}>
              <Icon name="star" size={16} color="#FFC107" fill="#FFC107" />
              <Text style={[styles.ratingText, { color: theme.text }]}>
                {exercise.rating?.toFixed(1) || '4.5'}
              </Text>
              <Text style={[styles.ratingCount, { color: theme.textSecondary }]}>
                ({exercise.reviewCount || '128'})
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    maxWidth: 500,
    alignSelf: 'center',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    minHeight: 180,
    maxHeight: 300,
    position: 'relative',
    overflow: 'hidden',
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
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  content: {
    padding: SCREEN_WIDTH > 768 ? 24 : 18,
  },
  title: {
    fontSize: SCREEN_WIDTH > 768 ? 22 : 20,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: SCREEN_WIDTH > 768 ? 15 : 14,
    lineHeight: SCREEN_WIDTH > 768 ? 22 : 20,
    marginBottom: 14,
    opacity: 0.8,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: SCREEN_WIDTH > 768 ? 12 : 10,
    paddingVertical: SCREEN_WIDTH > 768 ? 8 : 7,
    borderRadius: 10,
  },
  detailText: {
    fontSize: SCREEN_WIDTH > 768 ? 13 : 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 6,
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  difficultyText: {
    fontSize: 13,
    fontWeight: '700',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '700',
  },
  ratingCount: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ExerciseCard;
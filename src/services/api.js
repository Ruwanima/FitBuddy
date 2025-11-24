import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Authentication service using DummyJSON API
 */
export const authService = {
  /**
   * Login user - uses DummyJSON auth endpoint
   */
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
        expiresInMins: 60,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  },

  /**
   * Register user - simulated with DummyJSON user endpoint
   */
  register: async (userData) => {
    try {
      // DummyJSON doesn't have a real register endpoint, so we'll simulate it
      // In production, this would call a real registration API
      const response = await api.get('/users/1');
      return {
        success: true,
        data: {
          id: Date.now(),
          username: userData.username,
          email: userData.email,
          firstName: userData.username,
          lastName: 'User',
          token: 'simulated_token_' + Date.now(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Registration failed. Please try again.',
      };
    }
  },

  /**
   * Get current user details
   */
  getCurrentUser: async (token) => {
    try {
      const response = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch user details.',
      };
    }
  },
};

/**
 * Exercise/Fitness service using DummyJSON products as exercise data
 */
export const fitnessService = {
  /**
   * Get all exercises - uses products API as exercise data
   */
  getExercises: async (limit = 30) => {
    try {
      const response = await api.get(`/products?limit=${limit}`);
      // Transform products into exercise data
      const exercises = response.data.products.map((product, index) => ({
        id: product.id,
        title: generateExerciseName(product.title, index),
        description: generateExerciseDescription(product.description),
        category: getExerciseCategory(index),
        difficulty: getDifficultyLevel(index),
        duration: Math.floor(Math.random() * 45) + 15, // 15-60 minutes
        calories: Math.floor(Math.random() * 400) + 100, // 100-500 calories
        image: product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/150',
        rating: product.rating || 4.5,
        status: getExerciseStatus(index),
      }));
      return {
        success: true,
        data: exercises,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch exercises.',
        data: [],
      };
    }
  },

  /**
   * Get single exercise details
   */
  getExerciseById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      const product = response.data;
      const exercise = {
        id: product.id,
        title: generateExerciseName(product.title, product.id),
        description: generateDetailedDescription(product.description),
        category: getExerciseCategory(product.id),
        difficulty: getDifficultyLevel(product.id),
        duration: Math.floor(Math.random() * 45) + 15,
        calories: Math.floor(Math.random() * 400) + 100,
        image: product.thumbnail || product.images?.[0],
        images: product.images || [],
        rating: product.rating || 4.5,
        reviews: product.reviews || [],
        status: getExerciseStatus(product.id),
        benefits: generateBenefits(),
        equipment: generateEquipment(product.id),
      };
      return {
        success: true,
        data: exercise,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch exercise details.',
      };
    }
  },
};

// Helper functions to transform product data into exercise data
const exerciseNames = [
  'Morning Cardio Run', 'Full Body HIIT', 'Yoga Flow', 'Strength Training',
  'Cycling Workout', 'Swimming Session', 'Pilates Core', 'Boxing Cardio',
  'Dance Fitness', 'CrossFit WOD', 'Stretching Routine', 'Abs Burner',
  'Leg Day Power', 'Upper Body Blast', 'Outdoor Walk', 'Jump Rope',
  'Kettlebell Circuit', 'Bodyweight Challenge', 'Meditation & Breathing', 'Sports Training',
];

function generateExerciseName(productTitle, index) {
  return exerciseNames[index % exerciseNames.length] || 'Fitness Workout';
}

function generateExerciseDescription(productDesc) {
  const descriptions = [
    'Boost your fitness with this effective workout routine.',
    'Perfect for building strength and endurance.',
    'Improve flexibility and reduce stress.',
    'High-intensity workout to burn maximum calories.',
    'Low-impact exercise suitable for all fitness levels.',
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateDetailedDescription(productDesc) {
  return `This comprehensive workout routine is designed to help you achieve your fitness goals. ${productDesc || 'Follow along with expert guidance and proper form to maximize results.'}`;
}

function getExerciseCategory(index) {
  const categories = ['Cardio', 'Strength', 'Yoga', 'Flexibility', 'Sports', 'Walking'];
  return categories[index % categories.length];
}

function getDifficultyLevel(index) {
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  return levels[index % levels.length];
}

function getExerciseStatus(index) {
  const statuses = ['Popular', 'Trending', 'New', 'Recommended', 'Active'];
  return statuses[index % statuses.length];
}

function generateBenefits() {
  return [
    'Improves cardiovascular health',
    'Builds muscle strength',
    'Increases flexibility',
    'Burns calories effectively',
    'Reduces stress and anxiety',
    'Boosts energy levels',
  ];
}

function generateEquipment(index) {
  const equipmentOptions = [
    ['None - Bodyweight Only'],
    ['Dumbbells', 'Resistance Bands'],
    ['Yoga Mat'],
    ['Kettlebell', 'Jump Rope'],
    ['None - Outdoor Activity'],
    ['Exercise Mat', 'Foam Roller'],
  ];
  return equipmentOptions[index % equipmentOptions.length];
}

export default api;

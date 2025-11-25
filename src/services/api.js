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

// Custom fitness images array
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
        image: customExerciseImages[index % customExerciseImages.length],
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
      const imageIndex = (product.id - 1) % customExerciseImages.length;
      const exercise = {
        id: product.id,
        title: generateExerciseName(product.title, product.id),
        description: generateDetailedDescription(product.description),
        category: getExerciseCategory(product.id),
        difficulty: getDifficultyLevel(product.id),
        duration: Math.floor(Math.random() * 45) + 15,
        calories: Math.floor(Math.random() * 400) + 100,
        image: customExerciseImages[imageIndex],
        images: [customExerciseImages[imageIndex]],
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

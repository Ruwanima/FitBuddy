import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import { logout, updateUser } from '../redux/authSlice';
import { toggleTheme } from '../redux/themeSlice';
import { clearFavorites } from '../redux/favoritesSlice';
import { removeItem, setItem, getItem } from '../utils/storage';
import { STORAGE_KEYS, THEME_MODE } from '../utils/constants';
import { lightTheme, darkTheme } from '../styles/theme';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);
  const themeMode = useSelector((state) => state.theme.mode);
  const theme = themeMode === THEME_MODE.LIGHT ? lightTheme : darkTheme;

  const isDarkMode = themeMode === THEME_MODE.DARK;

  // Set default user if not exists
  const currentUser = user || {
    firstName: 'Pasindu',
    lastName: 'Ruwanima',
    email: 'pasindu@fitbuddy.com',
    username: 'pasindu',
    phone: '+94 77 123 4567',
    age: '22',
    weight: '70',
    height: '175',
    goal: 'Build Muscle'
  };

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState(currentUser.firstName);
  const [editedLastName, setEditedLastName] = useState(currentUser.lastName);
  const [editedEmail, setEditedEmail] = useState(currentUser.email);
  const [editedPhone, setEditedPhone] = useState(currentUser.phone || '');
  const [editedAge, setEditedAge] = useState(currentUser.age || '');
  const [editedWeight, setEditedWeight] = useState(currentUser.weight || '');
  const [editedHeight, setEditedHeight] = useState(currentUser.height || '');
  const [editedGoal, setEditedGoal] = useState(currentUser.goal || '');

  const handleThemeToggle = async () => {
    dispatch(toggleTheme());
    const newTheme = isDarkMode ? THEME_MODE.LIGHT : THEME_MODE.DARK;
    await setItem(STORAGE_KEYS.THEME, newTheme);
  };

  const handleEditProfile = () => {
    setEditedFirstName(currentUser.firstName);
    setEditedLastName(currentUser.lastName);
    setEditedEmail(currentUser.email);
    setEditedPhone(currentUser.phone || '');
    setEditedAge(currentUser.age || '');
    setEditedWeight(currentUser.weight || '');
    setEditedHeight(currentUser.height || '');
    setEditedGoal(currentUser.goal || '');
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editedFirstName.trim() || !editedLastName.trim()) {
      Alert.alert('Error', 'First name and last name are required');
      return;
    }

    const updatedUser = {
      ...currentUser,
      firstName: editedFirstName.trim(),
      lastName: editedLastName.trim(),
      email: editedEmail.trim(),
      phone: editedPhone.trim(),
      age: editedAge.trim(),
      weight: editedWeight.trim(),
      height: editedHeight.trim(),
      goal: editedGoal.trim(),
    };

    dispatch(updateUser(updatedUser));
    await setItem(STORAGE_KEYS.USER_DATA, updatedUser);
    setEditModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await removeItem(STORAGE_KEYS.USER_TOKEN);
            await removeItem(STORAGE_KEYS.USER_DATA);
            dispatch(logout());
          },
        },
      ]
    );
  };

  const calculateBMI = () => {
    const weight = parseFloat(currentUser.weight);
    const height = parseFloat(currentUser.height);
    
    if (weight && height && height > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { text: 'Underweight', color: '#2196F3' };
    if (bmiValue < 25) return { text: 'Normal', color: '#4CAF50' };
    if (bmiValue < 30) return { text: 'Overweight', color: '#FFC107' };
    return { text: 'Obese', color: '#F44336' };
  };

  const handleClearFavorites = () => {
    Alert.alert(
      'Clear Favorites',
      'Are you sure you want to remove all favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            dispatch(clearFavorites());
            await removeItem(STORAGE_KEYS.FAVORITES);
            Alert.alert('Success', 'All favorites have been cleared.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Icon name="edit-2" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <Icon name="user" size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.headerName}>
          {currentUser.firstName} {currentUser.lastName}
        </Text>
        <Text style={styles.headerEmail}>{currentUser.email || currentUser.username}</Text>
      </View>

      <View style={styles.content}>
        {calculateBMI() && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>HEALTH METRICS</Text>
            
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={styles.bmiContainer}>
                <View style={styles.bmiLeft}>
                  <Icon name="trending-up" size={32} color={getBMICategory(calculateBMI()).color} />
                  <View style={styles.bmiInfo}>
                    <Text style={[styles.bmiLabel, { color: theme.textSecondary }]}>Body Mass Index</Text>
                    <View style={styles.bmiValueRow}>
                      <Text style={[styles.bmiValue, { color: theme.text }]}>{calculateBMI()}</Text>
                      <View style={[styles.bmiCategoryBadge, { backgroundColor: getBMICategory(calculateBMI()).color + '33' }]}>
                        <Text style={[styles.bmiCategory, { color: getBMICategory(calculateBMI()).color }]}>
                          {getBMICategory(calculateBMI()).text}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>PERSONAL INFO</Text>
          
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            {currentUser.phone && (
              <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
                <Icon name="phone" size={20} color={theme.primary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Phone</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{currentUser.phone}</Text>
                </View>
              </View>
            )}
            
            {currentUser.age && (
              <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
                <Icon name="calendar" size={20} color={theme.primary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Age</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{currentUser.age} years</Text>
                </View>
              </View>
            )}
            
            {currentUser.weight && (
              <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
                <Icon name="activity" size={20} color={theme.primary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Weight</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{currentUser.weight} kg</Text>
                </View>
              </View>
            )}
            
            {currentUser.height && (
              <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
                <Icon name="maximize-2" size={20} color={theme.primary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Height</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{currentUser.height} cm</Text>
                </View>
              </View>
            )}
            
            {currentUser.goal && (
              <View style={styles.infoItem}>
                <Icon name="target" size={20} color={theme.primary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Fitness Goal</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{currentUser.goal}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>STATISTICS</Text>
          
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Icon name="heart" size={24} color={theme.primary} />
                <View style={styles.statContent}>
                  <Text style={[styles.statValue, { color: theme.text }]}>
                    {favorites.length}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                    Favorites
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>PREFERENCES</Text>
          
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={[styles.menuItem, { borderBottomColor: theme.border }]}>
              <View style={styles.menuLeft}>
                <Icon name={isDarkMode ? 'moon' : 'sun'} size={22} color={theme.text} />
                <Text style={[styles.menuText, { color: theme.text }]}>Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeToggle}
                trackColor={{ false: '#767577', true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ACTIONS</Text>
          
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomColor: theme.border }]}
              onPress={handleClearFavorites}
              disabled={favorites.length === 0}
            >
              <View style={styles.menuLeft}>
                <Icon name="trash-2" size={22} color={favorites.length === 0 ? theme.textSecondary : theme.warning} />
                <Text style={[styles.menuText, { color: favorites.length === 0 ? theme.textSecondary : theme.text }]}>
                  Clear Favorites
                </Text>
              </View>
              <Icon name="chevron-right" size={22} color={theme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <View style={styles.menuLeft}>
                <Icon name="log-out" size={22} color={theme.error} />
                <Text style={[styles.menuText, { color: theme.error }]}>Logout</Text>
              </View>
              <Icon name="chevron-right" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            FitBuddy v1.0.0
          </Text>
        </View>
      </View>

      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="x" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>First Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                  value={editedFirstName}
                  onChangeText={setEditedFirstName}
                  placeholder="Enter first name"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Last Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                  value={editedLastName}
                  onChangeText={setEditedLastName}
                  placeholder="Enter last name"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Email</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                  value={editedEmail}
                  onChangeText={setEditedEmail}
                  placeholder="Enter email"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Phone</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                  value={editedPhone}
                  onChangeText={setEditedPhone}
                  placeholder="Enter phone number"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Age</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                    value={editedAge}
                    onChangeText={setEditedAge}
                    placeholder="Age"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="number-pad"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Weight (kg)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                    value={editedWeight}
                    onChangeText={setEditedWeight}
                    placeholder="Weight"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Height (cm)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                  value={editedHeight}
                  onChangeText={setEditedHeight}
                  placeholder="Enter height"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Fitness Goal</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                  value={editedGoal}
                  onChangeText={setEditedGoal}
                  placeholder="e.g., Build Muscle, Lose Weight, Stay Fit"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.border }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={handleSaveProfile}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingTop: 60,
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 8,
    zIndex: 1,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  bmiContainer: {
    padding: 20,
  },
  bmiLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bmiInfo: {
    marginLeft: 16,
    flex: 1,
  },
  bmiLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  bmiValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bmiValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  bmiCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bmiCategory: {
    fontSize: 14,
    fontWeight: '600',
  },
  statRow: {
    padding: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statContent: {
    marginLeft: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  inputRow: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;

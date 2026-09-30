import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const fallback = {
  async getItem(key) {
    if (isWeb) return Promise.resolve(localStorage.getItem(key));
    return Promise.resolve(null);
  },
  async setItem(key, value) {
    if (isWeb) {
      localStorage.setItem(key, value);
      return Promise.resolve();
    }
    return Promise.resolve();
  },
  async removeItem(key) {
    if (isWeb) {
      localStorage.removeItem(key);
      return Promise.resolve();
    }
    return Promise.resolve();
  },
};

const storage = {
  async getItem(key) {
    try {
      if (!AsyncStorage || typeof AsyncStorage.getItem !== 'function') throw new Error('No native AsyncStorage');
      return await AsyncStorage.getItem(key);
    } catch (e) {
      return fallback.getItem(key);
    }
  },
  async setItem(key, value) {
    try {
      if (!AsyncStorage || typeof AsyncStorage.setItem !== 'function') throw new Error('No native AsyncStorage');
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      return fallback.setItem(key, value);
    }
  },
  async removeItem(key) {
    try {
      if (!AsyncStorage || typeof AsyncStorage.removeItem !== 'function') throw new Error('No native AsyncStorage');
      await AsyncStorage.removeItem(key);
    } catch (e) {
      return fallback.removeItem(key);
    }
  },
};

export default storage;

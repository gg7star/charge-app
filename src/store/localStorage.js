import AsyncStorage from '@react-native-community/async-storage';

export const storeData = async (key, value) => {
  try {
    console.log('===== storeData: ', value);
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // saving error
    console.log('====== AsyncStorage setItem error: ', e);
  }
}

export const loadData = async (key) => {
  let value = null;

  try {
    const jsonData = await AsyncStorage.getItem(key);
    const value = JSON.parse(jsonData);
    console.log('===== loadData: ', value);
    return value
  } catch(e) {
    console.log(`==== parsing error while read ${key} data in local storage:`, JSON.stringify(e));
  }

  return null;
}

export const removeData = async (key) => {
  await AsyncStorage.removeItem(key);
}

export default {
  storeData,
  loadData,
  removeData
}
import axios from 'axios';
import { Alert } from 'react-native';

export const triggerWatchFolder = async () => {
    try {
      const response = await axios.get('https://script.google.com/a/macros/tsaversolutions.net/s/AKfycby2qGcoEfXBCs0nelL4TbVjAstehPa8O4J6zmJiESy1Vgf_VOQAJtIEaMo1yJK79Gm7cg/exec');
      
      if (response.status === 200 && response.data) {
        console.log('Script response:', response.data);
        Alert.alert('Success', 'WatchFolder function triggered successfully.');
      } else {
        console.warn('Unexpected response:', response);
        Alert.alert('Warning', 'Received an unexpected response from the script.');
      }
    } catch (error) {
      console.error('Error:', error.response || error);
      Alert.alert('Error', `Failed to trigger watchFolder function: ${error.message}`);
    }
};
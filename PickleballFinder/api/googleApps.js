import axios from 'axios';
import { Alert } from 'react-native'; 

export const triggerWatchFolder = async () => {
    try {
      const response = await axios.get('https://script.google.com/a/macros/tsaversolutions.net/s/AKfycby2qGcoEfXBCs0nelL4TbVjAstehPa8O4J6zmJiESy1Vgf_VOQAJtIEaMo1yJK79Gm7cg/exec');
      Alert.alert('Success', response.data);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to trigger watchFolder function.');
    }
};
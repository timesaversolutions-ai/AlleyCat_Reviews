import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { styles } from '../styles/styles';
import { triggerWatchFolder } from '../api/googleApps';

const ProfileScreen = () => {
  const [reloadKey, setReloadKey] = useState(0);

  const handlePress = async () => {
    try {
      await triggerWatchFolder();
      setReloadKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View key={reloadKey} style={styles.container}>
      <Text>Trigger Google Apps Script</Text>
      <Button title="Start Watching Folder" onPress={handlePress} />
    </View>
  );
};

export default ProfileScreen;


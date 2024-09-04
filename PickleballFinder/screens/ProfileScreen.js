import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import { triggerWatchFolder } from '../api/googleApps';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

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

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Logged out');
      })
      .catch(error => alert(error.message));
  };

  return (
    <View key={reloadKey} style={styles.container}>
      <Text>Email: {auth.currentUser?.email}</Text>
      <Text>Trigger Google Apps Script</Text>
      <Button title="Start Watching Folder" onPress={handlePress} />
      <TouchableOpacity onPress={handleSignOut}>
        <Text>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;


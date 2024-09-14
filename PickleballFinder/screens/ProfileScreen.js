import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Button, TouchableOpacity, FlatList } from 'react-native';
import { styles } from '../styles/styles';
import { watchFolder } from '../api/processAudio';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { getFavoriteCourts } from '../components/favorites';

const ProfileScreen = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const [favoriteCourts, setFavoriteCourts] = useState([]);

  useEffect(() => {
    const fetchFavoriteCourts = async () => {
      if (auth.currentUser) {
        try {
          const userId = auth.currentUser.uid; // Get the current user's ID
          const courts = await getFavoriteCourts(userId);
          setFavoriteCourts(courts); // Store favorite courts in state
        } catch (error) {
          console.error('Error fetching favorite courts:', error);
        }
      }
    };

    fetchFavoriteCourts();
  }, [reloadKey]); // Reload the favorite courts whenever reloadKey changes

  const handlePress = async () => {
    try {
      await watchFolder();
      setReloadKey(prevKey => prevKey + 1); // Force re-fetch of favorite courts
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

  const handleReloadFavorites = () => {
    setReloadKey(prevKey => prevKey + 1); // Increment reloadKey to reload the list
  };

  // Memoize the rendered list of favorite courts to avoid unnecessary re-renders
  const memoizedFavoriteCourts = useMemo(() => {
    return (
      <FlatList
        data={favoriteCourts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.courtName} - {item.city}, {item.state}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No favorite courts added yet.</Text>}
      />
    );
  }, [favoriteCourts]); // Re-compute only when favoriteCourts changes

  return (
    <View key={reloadKey} style={styles.container}>
      <Text>Email: {auth.currentUser?.email}</Text>
      <Text>Trigger Google Apps Script</Text>
      <Button title="Start Watching Folder" onPress={handlePress} />
      
      <Text>Your Favorite Courts:</Text>
      {memoizedFavoriteCourts}

      {/* Reload Button underneath the list */}
      <Button title="Reload Favorites" onPress={handleReloadFavorites} />

      <TouchableOpacity onPress={handleSignOut}>
        <Text>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

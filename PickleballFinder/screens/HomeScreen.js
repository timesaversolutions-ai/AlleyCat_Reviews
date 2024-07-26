import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import { fetchCourts } from '../api/googleSheets';
import { styles } from '../styles/styles';

const HomeScreen = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCourts = async () => {
      try {
        const data = await fetchCourts();
        setCourts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courts:', error);
        setLoading(false);
      }
    };

    getCourts();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.searchBar} placeholder="Search by zip code, city, etc." />
      <FlatList
        data={courts}
        renderItem={({ item }) => (
          <View style={styles.courtItem}>
            <Text>{item.name}</Text>
            <Text>{item.city}</Text>
            <Text>{item.distance}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default HomeScreen;

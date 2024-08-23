import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import { fetchCourts } from '../api/googleSheets';
import { fetchCourtImages } from '../api/googleDrive';
import { styles } from '../styles/styles';

const HomeScreen = ({ navigation }) => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const getCourts = async () => {
      try {
        const courtsData = await fetchCourts();

        // Fetch images for each court using the Google Drive API
        const courtsWithImages = await Promise.all(
          courtsData.map(async (court) => {
            const imageUri = await fetchCourtImages(court.Court);
            return { ...court, 'Court Image': imageUri };
          })
        );

        setCourts(courtsWithImages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courts or images:', error);
        setLoading(false);
      }
    };

    getCourts();
  }, []);

  const filteredCourts = courts.filter(court =>
    court.Court?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name, city, etc."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredCourts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courtItem}
            onPress={() => navigation.navigate('CourtDetails', { ...item })}
          >
            {item['Court Image'] ? (
              <Image
                source={{ uri: item['Court Image'] }}
                style={styles.courtImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>No Image Available</Text>
              </View>
            )}
            <Text>Court: {item.Court}</Text>
            <Text>City: {item.City}</Text>
            <Text>State: {item.State}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default HomeScreen;

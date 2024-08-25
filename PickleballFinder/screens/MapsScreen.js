import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, Button, Linking, Share } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchCourts } from '../api/googleSheets';
import { fetchCourtImages } from '../api/googleDrive';
import { styles } from '../styles/styles';
import Icon from 'react-native-vector-icons/Ionicons';

const MapsScreen = ({ navigation }) => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 37.7749, // Default latitude (San Francisco)
    longitude: -122.4194, // Default longitude (San Francisco)
  });

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
    court.Court?.toLowerCase().includes(search.toLowerCase()) ||
    court.City?.toLowerCase().includes(search.toLowerCase()) ||
    court.State?.toLowerCase().includes(search.toLowerCase())
  );
  

  const handleCourtSelect = (court) => {
    setSelectedLocation({
      latitude: parseFloat(court.Latitude),
      longitude: parseFloat(court.Longitude),
    });
  };

  const handleDirections = (court) => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${court.Address}`);
  };

  const handleCall = (court) => {
    const phoneNumber = court.Phone.replace(/[^0-9]/g, ''); // Remove all non-numeric characters
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleShare = (court) => {
    const encodedAddress = encodeURIComponent(court.Address);
    Share.share({
      message: `Here’s the link to the map: https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
    });
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.searchBar}>
        <Icon name="search" size={20} color="gray" style={{ paddingRight: 10 }} />
        <TextInput
        placeholder="Search by name, city, etc."
        value={search}
        onChangeText={setSearch}
        />
      </TouchableOpacity>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={selectedLocation} />
        </MapView>
      </View>
      <FlatList
        data={filteredCourts}
        renderItem={({ item }) => (
          <View style={styles.courtItem}>
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
            <TouchableOpacity
              style={styles.courtItemDetailsContainer}
              onPress={() => handleCourtSelect(item)}
            >
              <Text style={styles.courtName}>{item.Court}</Text>
              <Text>{item.City}</Text>
              <Text>{item.State}</Text>
            </TouchableOpacity>
            <View style={styles.mapsButtons}>
              <Button title="Directions" onPress={() => handleDirections(item)} />
              <Button title="Call" onPress={() => handleCall(item)} />
              <Button title="Share" onPress={() => handleShare(item)} />
              <Icon 
                onPress={() => navigation.navigate('CourtDetails', { ...item })}
                name="information-circle-outline" size={25} color="#007AFF" 
              />
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default MapsScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchCourts } from '../api/googleSheets';
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

  const filteredCourts = courts.filter(court =>
    court.Court?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCourtSelect = (court) => {
    setSelectedLocation({
      latitude: parseFloat(court.Latitude),
      longitude: parseFloat(court.Longitude),
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
          <View style={styles.courtItemContainer}>
            <TouchableOpacity
              style={styles.courtItem}
              onPress={() => handleCourtSelect(item)}
            >
              <Text style={styles.courtName}>Court: {item.Court}</Text>
              <Text>City: {item.City}</Text>
              <Text>State: {item.State}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigation.navigate('CourtDetails', { ...item })}
            >
              <Icon name="information-circle-outline" size={25} color="#007AFF" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default MapsScreen;

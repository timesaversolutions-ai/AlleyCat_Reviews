import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import { fetchCourts } from '../api/googleSheets';
import { fetchCourtImages } from '../api/googleDrive';
import { styles } from '../styles/styles';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const renderIcons = (num) => {
    const icons = [];
    for (let i = 0; i < num; i++) {
      icons.push(<Icon key={i} name="star" size={20} color="black" style={styles.icon} />);
    }
    return icons;
  };

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
  

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    // <Icon name="flask" size={30} color="black" style={styles.icon} />
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="gray" style={{ paddingRight: 10 }} />
        <TextInput
        placeholder="Search by name, city, etc."
        value={search}
        onChangeText={setSearch}
        />
        <Icon name="filter" size={20} color="gray" style={{ marginLeft: 125 }} />
      </View>
      <FlatList
        data={filteredCourts}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('CourtDetails', { ...item })}
            style={styles.courtItem}
          >
            {item['Court Image'] ? (
              <Image
                source={{ uri: item['Court Image'] }}
                style={styles.homeScreenCourtImage} 
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>No Image Available</Text>
              </View>
            )}
            <View style={styles.courtItemDetailsContainer}>
              <Text style={styles.courtName}>
                {item.Court}
              </Text>
              <View style={styles.iconContainer}>
                {renderIcons(Number(item['AlleyCat Score']) || 0)}
              </View>
              <Text style={styles.courtItemDetailsText}>
                {item.City}, {item.State}{"\n"}
                {item['# of courts']} courts
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default HomeScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, Button, Linking, Share, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchCourts } from '../api/googleSheets';
import { fetchCourtImages } from '../api/googleDrive';
import { styles } from '../styles/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-reanimated-carousel';

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
            const imageUris = await fetchCourtImages(court.Court);
            return { ...court, images: imageUris };
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

  const CourtImagesCarousel = ({ images }) => {
    const width = Dimensions.get('window').width;

    return (
        <View style={{ flex: 1 }}>
            <Carousel
                loop
                width={width}
                height={width / 2}
                // autoPlay={true}
                data={images}
                panGestureHandlerProps={{
                  activeOffsetX: [-10, 10],
                }}
                scrollAnimationDuration={250}
                renderItem={({ item }) => (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image 
                            source={{ uri: item }} 
                            style={{ width: '100%', height: '100%', borderRadius: 10 }} 
                            resizeMode="cover"
                        />
                    </View>
                )}
            />
        </View>
    );
  };

  const filteredCourts = courts.filter(court =>
    court.Court?.toLowerCase().includes(search.toLowerCase()) ||
    court.City?.toLowerCase().includes(search.toLowerCase()) ||
    court.State?.toLowerCase().includes(search.toLowerCase())
  );
  
  const renderIcons = (num) => {
    const icons = [];
    for (let i = 0; i < num; i++) {
      icons.push(<Icon key={i} name="star" size={20} color="black" style={styles.icon} />);
    }
    return icons;
  };

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
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="gray" style={{ paddingRight: 10 }} />
        <TextInput
        placeholder="Search by name, city, etc."
        value={search}
        onChangeText={setSearch}
        />
        <Icon name="filter" size={20} color="gray" style={{ marginLeft: 125 }} />
      </View>
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
            <TouchableOpacity
            onPress={() => navigation.navigate('CourtDetails', { ...item })}
            >
              {item.images && item.images.length > 0 ? (
                <CourtImagesCarousel images={item.images} />
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
            
            <View style={styles.mapsButtonContainer}>
              <View style={styles.mapsButtons} >
                <Icon name="arrow-redo-circle-outline" size={20} color="gray" />
                <Button title="Directions" onPress={() => handleDirections(item)} color="black" />
              </View>
              <View style={styles.mapsButtons} >
              <Icon name="call-outline" size={20} color="gray" />
                <Button style={styles.mapsButtons} title="Call" onPress={() => handleCall(item)} color="black" />
              </View>
              <View style={styles.mapsButtons} >
              <Icon name="share-outline" size={20} color="gray" />
                <Button style={styles.mapsButtons} title="Share" onPress={() => handleShare(item)} color="black"/>
              </View>
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

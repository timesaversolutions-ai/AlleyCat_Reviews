import React, { useEffect, useState, memo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, Button, Linking, Share, Dimensions, ScrollView, Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchCourts } from '../api/googleSheets';
import { fetchCourtImages } from '../api/googleDrive';
import { findPlace } from '../api/googleMaps';
import { styles } from '../styles/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-reanimated-carousel';

const MapsScreen = ({ navigation }) => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [region, setRegion] = useState({
    latitude: 37.7749, // Default latitude (San Francisco)
    longitude: -122.4194, // Default longitude (San Francisco)
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
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

  const CourtImagesCarousel = memo(({ images }) => {
    const width = Dimensions.get('window').width;

    return (
      <View style={{ flex: 1 }}>
          <Carousel
              loop
              width={width / 3}
              height={width / 4}
              style={{ width: width }}
              data={images}
              panGestureHandlerProps={{
                  activeOffsetX: [-10, 10],
              }}
              scrollAnimationDuration={0}
              renderItem={({ item }) => (
                  <View
                      style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingVertical: 10,
                      }}
                  >
                      <Image
                          source={{ uri: item }}
                          style={{
                              width: '95%',
                              height: '100%',
                              borderRadius: 10,
                              marginHorizontal: 5,
                          }}
                          resizeMode="cover"
                      />
                  </View>
              )}
          />
      </View>
    );
  }, (prevProps, nextProps) => prevProps.images === nextProps.images);

  const CourtListItem = memo(({ item, onSelect }) => (
    <View style={styles.courtItem}>
      {item.images && item.images.length > 0 ? (
        <CourtImagesCarousel images={item.images} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>No Image Available</Text>
        </View>
      )}
      <TouchableOpacity onPress={() => onSelect(item)}>
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
          <TouchableOpacity onPress={() => handleDirections(item)}>
            <Text style={styles.buttonText}>Directions</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mapsButtons} >
          <Icon name="call-outline" size={20} color="gray" />
          <TouchableOpacity onPress={() => handleCall(item)}>
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mapsButtons} >
          <Icon name="share-outline" size={20} color="gray" />
          <TouchableOpacity onPress={() => handleShare(item)}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </View>
        <Icon 
          onPress={() => navigation.navigate('CourtDetails', { ...item })}
          name="information-circle-outline" size={25} color="#007AFF" 
        />
      </View>
    </View>
  ), (prevProps, nextProps) => prevProps.item === nextProps.item);

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
    setRegion({
      latitude: parseFloat(court.Latitude),
      longitude: parseFloat(court.Longitude),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const handleSearchChange = (text) => {
    setSearch(text);

    // Filter courts based on the search text
    const filtered = courts.filter(court =>
      court.Court?.toLowerCase().includes(text.toLowerCase()) ||
      court.City?.toLowerCase().includes(text.toLowerCase()) ||
      court.State?.toLowerCase().includes(text.toLowerCase())
    );

    setSuggestions(filtered);
  };

  const handleSuggestionSelect = async (court) => {
    setSearch(court.Court);
    setSuggestions([]);

    const location = await findPlace(`${court.Court}, ${court.City}, ${court.State}`);
    if (location) {
      setRegion({
        ...location,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const handleSearch = async () => {
    if (search) {
      const location = await findPlace(search);
      if (location) {
        setRegion({
          ...location,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    setSuggestions([]);
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
          onChangeText={handleSearchChange}
          onSubmitEditing={handleSearch}
          style={{ flex: 1 }}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Icon name="close-circle" size={20} color="gray" style={{ paddingRight: 10 }} />
          </TouchableOpacity>
        )}
        <Icon name="filter" size={20} color="gray" style={{ paddingRight: 20 }} />
      </View>

      {suggestions.length > 0 && (
        <ScrollView 
          style={styles.suggestionsContainer}
          keyboardShouldPersistTaps="handled"
        >
          {suggestions.map((court, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                Keyboard.dismiss();
                handleSuggestionSelect(court);
                handleCourtSelect(court);
              }}
            >
              <Text>{court.Court} - {court.City}, {court.State}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
        >
          {courts.map((court, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(court.Latitude),
                longitude: parseFloat(court.Longitude),
              }}
              title={court.Court}
              description={`${court.City}, ${court.State}`}
              onPress={() => handleCourtSelect(court)}
            />
          ))}
        </MapView>
      </View>
      <FlatList
        ref={(ref) => { this.flatListRef = ref; }}
        initialNumToRender={10}
        data={filteredCourts}
        renderItem={({ item }) => (
          <CourtListItem item={item} onSelect={() => navigation.navigate('CourtDetails', { ...item })} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default MapsScreen;

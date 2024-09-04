import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, Dimensions, Button } from 'react-native';
import { fetchCourts } from '../api/googleSheets';
import { fetchCourtImages } from '../api/googleDrive';
import { styles } from '../styles/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-reanimated-carousel';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'

const HomeScreen = ({ navigation }) => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);

  const renderIcons = (num) => {
    const icons = [];
    for (let i = 0; i < num; i++) {
      icons.push(<Icon key={i} name="star" size={20} color="black" style={styles.icon} />);
    }
    return icons;
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Logged out');
      })
      .catch(error => alert(error.message));
  };

  useEffect(() => {
    // Function to get courts
    const getCourts = async () => {
      try {
        const courtsData = await fetchCourts();

        // Fetch images for each court using Google Drive API
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

    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser); // User is logged in
      } else {
        setUser(null); // No user is logged in
      }
    });

    // Fetch courts data
    getCourts();

    // Clean up the auth state listener
    return unsubscribe;
  }, []);

  const CourtImagesCarousel = ({ images }) => {
    const width = Dimensions.get('window').width;

    return (
        <View style={{ flex: 1 }}>
            <Carousel
                loop
                width={width}
                height={width / 2}
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
      <Text style={styles.sectionHeader}>
        Explore Courts
      </Text>
      <View>
        {user ? (
          <View>
            <Text>Your email: {user.email}</Text>
            <Button title="Sign Out" onPress={handleSignOut} />
          </View>
        ) : (
          <View>
            <Button title="Login/Signup" onPress={() => navigation.navigate('LoginScreen')} />
          </View>
        )}
      </View>
      <FlatList
        data={filteredCourts}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('CourtDetails', { ...item })}
            style={styles.courtItem}
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
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default HomeScreen;

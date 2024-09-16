const DEV_MODE = true; // Set this to false for production

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, Dimensions, Button } from 'react-native';
import { fetchCourts } from '../api/googleSheets';
import { fetchCourtImages } from '../components/storage';
import { styles } from '../styles/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-reanimated-carousel';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { addCourtToFavorites, removeCourtFromFavorites, getFavoriteCourts } from '../components/favorites';

const HomeScreen = ({ navigation }) => {
  // 1. State variables
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [favoriteCourts, setFavoriteCourts] = useState([]);

  // 2. Helper functions
  const renderIcons = (num) => {
    const icons = [];
    for (let i = 0; i < num; i++) {
      icons.push(<Icon key={i} name="star" size={20} color="black" style={styles.icon} />);
    }
    return icons;
  };

  const checkIfFavorite = (court, favoriteCourts) => {
    return favoriteCourts.some(favorite => favorite.courtName === court.Court);
  };

  const renderFavoriteButton = (court) => {
    const isFavorite = checkIfFavorite(court, favoriteCourts);

    return (
      <Icon 
        name={isFavorite ? 'heart' : 'heart-outline'} 
        size={24} 
        color={isFavorite ? 'red' : 'white'}
      />
    );
  };

  // 3. useEffect to handle fetching courts and favorite courts
  useEffect(() => {
    const getCourts = async () => {
      try {
        const courtsData = await fetchCourts();
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

    const fetchFavoriteCourts = async () => {
      if (user) {
        if (DEV_MODE) {
          // Use mock data for favorites in dev mode
          setFavoriteCourts([
            { id: '1', courtName: 'Mock Court 1', city: 'Mock City', state: 'MS' },
            { id: '2', courtName: 'Mock Court 2', city: 'Mock City', state: 'MS' },
          ]);
        } else {
          const favorites = await getFavoriteCourts(user.uid);
          setFavoriteCourts(favorites);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchFavoriteCourts();
      } else {
        setUser(null);
        setFavoriteCourts([]);
      }
    });

    getCourts();
    return unsubscribe;
  }, [user]);

  // 4. CourtImagesCarousel Component
  const CourtImagesCarousel = ({ images }) => {
    const width = Dimensions.get('window').width;

    return (
      <View style={{ flex: 1, overflow: 'hidden', borderRadius: 10 }}>
        <Carousel
          loop
          width={width - 20}
          height={width / 2}
          data={images}
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
          }}
          scrollAnimationDuration={0}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <Image
                source={{ uri: item }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 10,
                }}
                resizeMode="cover"
              />
            </View>
          )}
        />
      </View>
    );
  };

  // 5. Filter courts based on search input
  const filteredCourts = courts.filter(court =>
    court.Court?.toLowerCase().includes(search.toLowerCase()) ||
    court.City?.toLowerCase().includes(search.toLowerCase()) ||
    court.State?.toLowerCase().includes(search.toLowerCase())
  );

  // 6. Handle SignOut
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        alert('Logged out');
      })
      .catch(error => alert(error.message));
  };

  // 7. Return JSX (UI components)
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
      </View>

      <Text style={styles.sectionHeader}>Explore Courts</Text>

      <View>
        {user ? (
          <View>
            <Text>Your email: {user.email}</Text>
            <View style={styles.loginButtons}>
              <TouchableOpacity onPress={handleSignOut}>
                <Text style={styles.buttonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.loginButtons}>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
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
            <View style={styles.imageContainer}>
              {item.images && item.images.length > 0 ? (
                <CourtImagesCarousel images={item.images} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>No Image Available</Text>
                </View>
              )}
              {user && (
                <TouchableOpacity
                  style={styles.favoriteIconContainer}
                  onPress={async () => {
                    // Your existing favorite toggle logic here
                    if (DEV_MODE) {
                      // Simulate adding/removing favorites in dev mode
                      setFavoriteCourts(prev => 
                        checkIfFavorite(item, favoriteCourts)
                          ? prev.filter(fav => fav.courtName !== item.Court)
                          : [...prev, { id: Date.now().toString(), courtName: item.Court, city: item.City, state: item.State }]
                      );
                    } else {
                      // Your existing Firestore logic here
                    }
                  }}
                >
                  {renderFavoriteButton(item)}
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.courtItemDetailsContainer}>
              <Text style={styles.courtName}>{item.Court}</Text>
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
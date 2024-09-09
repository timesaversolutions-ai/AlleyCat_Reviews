import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, Dimensions, Button } from 'react-native';
import { fetchCourts } from '../api/googleSheets';
import { fetchCourtImages } from '../api/googleDrive';
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
      <Button
        title={isFavorite ? 'Unfavorite' : 'Favorite'}
        onPress={async () => {
          if (isFavorite) {
            const favoriteToRemove = favoriteCourts.find(fav => fav.courtName === court.Court);
            if (favoriteToRemove) {
              await removeCourtFromFavorites(favoriteToRemove.id);
            }
          } else {
            await addCourtToFavorites(user.uid, court);
          }

          // Refresh favorite courts after adding/removing
          const updatedFavorites = await getFavoriteCourts(user.uid);
          setFavoriteCourts(updatedFavorites);
        }}
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
        const favorites = await getFavoriteCourts(user.uid);
        setFavoriteCourts(favorites);
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
      <View style={{ flex: 1 }}>
        <Carousel
          loop
          width={width}
          height={width / 2}
          data={images}
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
          }}
          scrollAnimationDuration={0}
          renderItem={({ item }) => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={{ uri: item }}
                style={{ width: '90%', height: '100%', borderRadius: 10 }}
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
              <Text style={styles.courtName}>{item.Court}</Text>
              {user ? (
                <View>{renderFavoriteButton(item)}</View>
              ) : (
                <Button title="Login to Favorite" onPress={() => navigation.navigate('LoginScreen')} />
              )}
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
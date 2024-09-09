import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, Image, Button, TouchableOpacity, Linking, Dimensions, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/styles';
import Carousel from 'react-native-reanimated-carousel';
import { addComment, getComments } from '../components/comments'; // Import comment operations
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const CourtDetailsScreen = ({ route, navigation }) => {
  const {
    Court,
    City,
    State,
    '# of courts': numOfCourts,
    'Ability Based Courts': abilityBasedCourts,
    'Permanent Lines': permanentLines,
    'Permanent Nets': permanentNets,
    'Paddle Rack/Queue': paddleRackQueue,
    'Premium Amenities': premiumAmenities,
    'additional comments': additionalComments,
    'additional enhancements': additionalEnhancements,
    'AlleyCat Score': alleyCatScore,
    'Address': address,
    'Phone': phone,
    'Hours': hours,
    'Website': website,
    images: images
  } = route.params;
  
  // hide hours
  const [hoursVisible, setHoursVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch comments when the screen loads
    const fetchCourtComments = async () => {
      const courtComments = await getComments(Court);
      setComments(courtComments);
    };
    
    fetchCourtComments();
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, [user]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const user = auth.currentUser;
      if (user) {
        await addComment(Court, user.uid, user.email, newComment); // Assuming you store username as email
        setNewComment(''); // Clear the input
        const updatedComments = await getComments(Court); // Refresh comments
        setComments(updatedComments);
      } else {
        alert('You must be logged in to post a comment.');
      }
    }
  };

  // Render comment list
  const renderComments = () => {
    return comments.map((comment) => (
      <View key={comment.id} style={styles.commentContainer}>
        <Text style={styles.commentAuthor}>{comment.userEmail}:</Text>
        <Text>{comment.content}</Text>
      </View>
    ));
  };


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

  // Function to render icons based on a number
  const renderIcons = (num) => {
    const icons = [];
    for (let i = 0; i < num; i++) {
      icons.push(<Icon key={i} name="star" size={30} color="#ffd700" style={styles.icon} />);
    }
    return icons;
  };

  // Function to parse and render the amenities or enhancements
  const renderAmenitiesOrEnhancements = (data) => {
    const cleanData = data.slice(1);
    const dataArray = cleanData.split(', ').map(item => {
      const [key, value] = item.split('=');
      return { key, value };
    });

    return dataArray.map((item, index) => (
      <View key={index} style={styles.detailRow}>
        <Text style={styles.detailKey}>{item.key.replace(/_/g, ' ')}:</Text>
        <Icon
          name={item.value === 'Yes' || item.value === true || item.value === 'true' ? 'checkmark-circle' : 'close-circle'}
          size={20}
          color={item.value === 'Yes' || item.value === true || item.value === 'true' ? 'green' : 'red'}
        />
      </View>
    ));
  };

  const renderIcon = (value) => {
    return (
      <Icon
        name={value === 'TRUE' ? 'checkmark-circle' : 'close-circle'}
        size={20}
        color={value === 'TRUE' ? 'green' : 'red'}
      />
    );
  };

  // Function to parse and render the hours
  const renderHours = (hoursData) => {
    const hoursArray = hoursData.replace('Hours=', '').split(', ').map(item => {
      const [day, time] = item.split(': ');
      return { day, time };
    });

    return hoursArray.map((item, index) => (
      <View key={index} style={styles.detailRow}>
        <Text style={styles.detailKey}>{item.day}:</Text>
        <Text style={styles.detailValue}>{item.time}</Text>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: 'left', flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="arrow-back-outline" size={20} color='black' />
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
      <View style={{ paddingBottom: 20 }} >
        {images && images.length > 0 ? (
            <CourtImagesCarousel images={images} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>No Image Available</Text>
              </View>
        )}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
        <Text style={styles.detailTitle}>{Court}</Text>
        <View style={styles.ratingDisplay}>
          {renderIcons(Number(alleyCatScore))}
        </View>
      </View>
      <View style={styles.detailsSection1}>
        <View style={{ flexDirection: 'row', paddingBottom: 15 }}>
          <Icon name="location-outline" size={20} color="gray" style={{ paddingRight: 10 }} />
          <Text style={{ width: '70%'}}>{address}</Text>
        </View>
        <View style={{ flexDirection: 'row', paddingBottom: 15 }}>
          <Icon name="call-outline" size={20} color="gray" style={{ paddingRight: 10 }} />
          <Text style={styles.detailLink} onPress={() => Linking.openURL(`tel:${phone}`)}>{phone}</Text>
        </View>
        <View style={{ flexDirection: 'row', paddingBottom: 15 }}>
          <Icon name="time-outline" size={20} color="gray" style={{ paddingRight: 10 }} />
          <TouchableOpacity style={{ flexDirection: 'row'  }} onPress={() => setHoursVisible(!hoursVisible)}>
            <Text>Hours of Operation</Text>
            <Icon name="chevron-down-outline" size={20} color="gray" />
          </TouchableOpacity>
        </View>
        {hoursVisible && renderHours(hours)}
        <View style={{ flexDirection: 'row' }}>
          <Icon name="link-outline" size={20} color="gray" style={{ paddingRight: 10 }} />
          <Text style={styles.detailLink} onPress={() => Linking.openURL(website)}>{website}</Text>
        </View>
      </View>
      
      <Text style={styles.detailHeader}>Court Description</Text>
      <Text style={styles.detailText}>{additionalComments}</Text>

      <Text style={styles.detailHeader}>Court Details</Text>
      <View style={styles.detailsSection2}> 
        <View style={styles.detailRow}>
          <Text style={styles.detailKey}>Number of Courts:</Text>
          <Text style={styles.detailValue}>{numOfCourts}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailKey}>Ability Based Courts:</Text>
          {renderIcon(abilityBasedCourts)}
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailKey}>Permanent Lines:</Text>
          {renderIcon(permanentLines)}
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailKey}>Permanent Nets:</Text>
          {renderIcon(permanentNets)}
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailKey}>Paddle Rack/Queue:</Text>
          {renderIcon(paddleRackQueue)}
        </View>
      </View>
      
      <Text style={styles.detailHeader}>Amenities and Features</Text>
      <View style={styles.detailsSection2}>
        {renderAmenitiesOrEnhancements(premiumAmenities)}
      </View>

      <Text style={styles.detailHeader}>Additional Enhancements</Text>
      <View style={styles.detailsSection2}>
        {renderAmenitiesOrEnhancements(additionalEnhancements)}
      </View>
      
      <View style={styles.ratingDisplay}>
        {renderIcons(Number(alleyCatScore))}
      </View>

      <Text style={styles.detailHeader}>Comments</Text>
      <View>
        {comments.length > 0 ? renderComments() : <Text>No comments yet.</Text>}
      </View>
      <KeyboardAvoidingView style={styles.container}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <Button title="Submit Comment" onPress={handleAddComment} />

        <View style={{ margin: 40 }}></View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default CourtDetailsScreen;

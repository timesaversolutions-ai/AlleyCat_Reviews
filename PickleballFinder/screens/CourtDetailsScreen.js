import React from 'react';
import { View, Text, ScrollView, Image, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/styles';

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
    'Court Image': courtImage // Include the court image passed from HomeScreen
  } = route.params;

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
      <View style={{ alignItems: 'left' }}>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
      <Text style={styles.detailTitle}>{Court}</Text>
      <View>
        {courtImage ? (
          <Image source={{ uri: courtImage }} alt={Court} style={styles.courtImage} />
        ) : (
          <Text>No Image Available</Text>
        )}
      </View>

      <View style={styles.iconContainer}>
        {renderIcons(Number(alleyCatScore))}
      </View>
      <Text style={styles.detailHeader}>Hours of Operation</Text>
      {renderHours(hours)}
      <View style={styles.detailRow}>
        <Text style={styles.detailKey}>Address:</Text>
        <Text style={styles.detailValue}>{address}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailKey}>Phone:</Text>
        <Text style={styles.detailValue}>{phone}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailKey}>Website:</Text>
        <Text style={styles.detailValue}>{website}</Text>
      </View>
      
      <Text style={styles.detailHeader}>Court Description</Text>
      <Text style={styles.detailText}>{additionalComments}</Text>
      <Text style={styles.detailHeader}>Court Details</Text>

      <View style={styles.detailRow}>
        <Text style={styles.detailKey}>Number of Courts:</Text>
        <Text style={styles.detailValue}>{numOfCourts}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailKey}>Ability Based Courts:</Text>
        <Text style={styles.detailValue}>{abilityBasedCourts}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailKey}>Permanent Lines:</Text>
        <Text style={styles.detailValue}>{permanentLines}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailKey}>Permanent Nets:</Text>
        <Text style={styles.detailValue}>{permanentNets}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailKey}>Paddle Rack/Queue:</Text>
        <Text style={styles.detailValue}>{paddleRackQueue}</Text>
      </View>
      
      <Text style={styles.detailHeader}>Amenities and Features</Text>
      {renderAmenitiesOrEnhancements(premiumAmenities)}

      <Text style={styles.detailHeader}>Additional Enhancements</Text>
      {renderAmenitiesOrEnhancements(additionalEnhancements)}
    </ScrollView>
  );
};

export default CourtDetailsScreen;

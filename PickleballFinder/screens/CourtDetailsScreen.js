import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Button, TouchableOpacity, Linking, } from 'react-native';
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
    'Court Image': courtImage
  } = route.params;
  
  // hide hours
  const [hoursVisible, setHoursVisible] = useState(false);

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
      <View>
        {courtImage ? (
          <Image source={{ uri: courtImage }} style={styles.homeScreenCourtImage} />
        ) : (
          <Text>No Image Available</Text>
        )}
      </View>
      <Text style={styles.detailTitle}>{Court}</Text>
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

    </ScrollView>
  );
};

export default CourtDetailsScreen;

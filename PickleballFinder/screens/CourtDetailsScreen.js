import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from '../styles/styles';

const CourtDetailsScreen = ({ route }) => {
  const { Court, City, State, '# of courts': numOfCourts, 'Ability Based Courts': abilityBasedCourts, 'Permanent Lines': permanentLines, 'Permanent Nets': permanentNets, 'Paddle Rack/Queue': paddleRackQueue, 'Premium Amenities': premiumAmenities, 'additional comments': additionalComments, 'additional enhancements': additionalEnhancements } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.detailTitle}>{Court}</Text>
      <Text style={styles.detailText}>Address</Text>
      <Text style={styles.detailText}>Phone</Text>
      <Text style={styles.detailText}>Hours</Text>
      <Text style={styles.detailText}>Website</Text>
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
      <View style={styles.detailRow}>
        <Text style={styles.detailKey}>Premium Amenities:</Text>
        <Text style={styles.detailValue}>{premiumAmenities}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailKey}>Additional Enhancements:</Text>
        <Text style={styles.detailValue}>{additionalEnhancements}</Text>
      </View>
    </ScrollView>
  );
};

export default CourtDetailsScreen;

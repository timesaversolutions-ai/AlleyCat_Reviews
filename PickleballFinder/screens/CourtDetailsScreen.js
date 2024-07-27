import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { styles } from '../styles/styles';
import courtImage from '../assets/sawyer_point.jpg'

// simple import image ex
// import React from 'react';
// import myImage from './path_to_your_image.png';
// const MyComponent = () => {
//   return (
//     <div>
//       <img src={myImage} alt="My Image" />
//     </div>
//   );
// };

// export default MyComponent;

const CourtDetailsScreen = ({ route }) => {
  console.log(courtImage);
  const { Court, City, State, '# of courts': numOfCourts, 'Ability Based Courts': abilityBasedCourts, 'Permanent Lines': permanentLines, 'Permanent Nets': permanentNets, 'Paddle Rack/Queue': paddleRackQueue, 'Premium Amenities': premiumAmenities, 'additional comments': additionalComments, 'additional enhancements': additionalEnhancements } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.detailTitle}>{Court}</Text>
      <View>
        <Image source={courtImage} alt="Sawyer Point" style={styles.courtImage} />
      </View>
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
      <Text style={styles.detailHeader}>Amenities and Features</Text>
      <Text style={styles.detailText}>{premiumAmenities}</Text>
      <Text style={styles.detailText}>{additionalEnhancements}</Text>
    </ScrollView>
  );
};

export default CourtDetailsScreen;

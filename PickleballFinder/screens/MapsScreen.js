// is working as intended. Just needs more data passed from googleSheets to work properly
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchCourts } from '../api/googleSheets';

const MapsScreen = () => {
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
        const data = await fetchCourts();
        setCourts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courts:', error);
        setLoading(false);
      }
    };

    getCourts();
  }, []);

  const filteredCourts = courts.filter(court =>
    court.Court?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCourtSelect = (court) => {
    setSelectedLocation({
      latitude: parseFloat(court.Latitude),
      longitude: parseFloat(court.Longitude),
    });
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name, city, etc."
        value={search}
        onChangeText={setSearch}
      />
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
          <TouchableOpacity
            style={styles.courtItem}
            onPress={() => handleCourtSelect(item)}
          >
            <Text style={styles.courtName}>Court: {item.Court}</Text>
            <Text>City: {item.City}</Text>
            <Text>State: {item.State}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  mapContainer: {
    height: '50%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  courtItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  courtName: {
    fontWeight: 'bold',
  },
});

export default MapsScreen;



// import React from 'react';
// import MapView from 'react-native-maps';
// import { StyleSheet, View } from 'react-native';

// const MapsScreen = () => {
//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: 37.7749,          // Latitude of the map center (San Francisco)
//           longitude: -122.4194,       // Longitude of the map center (San Francisco)
//           latitudeDelta: 0.0922,      // Determines the zoom level
//           longitudeDelta: 0.0421,     // Determines the zoom level
//         }}
//         showsUserLocation={true}       // Optional: Shows the user's location on the map
//         showsMyLocationButton={true}   // Optional: Shows a button to center the map on user's location
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: '100%',
//     height: '100%',
//   },
// });

// export default MapsScreen;



// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
// import Collapsible from 'react-native-collapsible';
// import { styles } from '../styles/styles';
// import { fetchCourts } from '../api/googleSheets';

// const MapsScreen = ({ navigation }) => {
//   const [courts, setCourts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [activeSections, setActiveSections] = useState([]);
//   const [isCollapsed, setIsCollapsed] = useState(true);  // New state for collapsible

//   useEffect(() => {
//     const getCourts = async () => {
//       try {
//         const data = await fetchCourts();
//         setCourts(data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching courts:', error);
//         setLoading(false);
//       }
//     };

//     getCourts();
//   }, []);

//   const filteredCourts = courts.filter(court =>
//     court.Court?.toLowerCase().includes(search.toLowerCase())
//   );

//   const toggleSection = index => {
//     setActiveSections(prevActiveSections =>
//       prevActiveSections.includes(index)
//         ? prevActiveSections.filter(i => i !== index)
//         : [...prevActiveSections, index]
//     );
//   };

//   const toggleCollapsed = () => { // Function to toggle collapsed state
//     setIsCollapsed(!isCollapsed);
//   };

//   if (loading) {
//     return <Text>Loading...</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.placeholderImage}>
//         <Text style={styles.placeholderText}>No Image Available</Text>
//       </View>
//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search by name, city, etc."
//         value={search}
//         onChangeText={setSearch}
//       />
//       <TouchableOpacity onPress={toggleCollapsed}>
//         <Text>{isCollapsed ? 'Show List' : 'Hide List'}</Text>
//       </TouchableOpacity>
//       <Collapsible collapsed={isCollapsed}>
//         <FlatList
//           data={filteredCourts}
//           renderItem={({ item, index }) => (
//             <View>
//               <TouchableOpacity
//                 style={styles.courtItem}
//                 onPress={() => toggleSection(index)}
//               >
//                 {item['Court Image'] ? (
//                   <Image
//                     source={{ uri: item['Court Image'] }} 
//                     style={styles.courtImage}
//                   />
//                 ) : (
//                   <View style={styles.placeholderImage}>
//                     <Text style={styles.placeholderText}>No Image Available</Text>
//                   </View>
//                 )}
//                 <Text>Court: {item.Court}</Text>
//                 <Text>City: {item.City}</Text>
//                 <Text>State: {item.State}</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//           keyExtractor={(item, index) => index.toString()}
//         />
//       </Collapsible>
//     </View>
//   );
// };

// export default MapsScreen;


// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
// import Collapsible from 'react-native-collapsible';
// import { styles } from '../styles/styles';
// import { fetchCourts } from '../api/googleSheets';

// const MapsScreen = ({ navigation }) => {
//   const [courts, setCourts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [activeSections, setActiveSections] = useState([]);
//   const [isCollapsed, setIsCollapsed] = useState(true);  // New state for collapsible

//   useEffect(() => {
//     const getCourts = async () => {
//       try {
//         const data = await fetchCourts();
//         setCourts(data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching courts:', error);
//         setLoading(false);
//       }
//     };

//     getCourts();
//   }, []);

//   const filteredCourts = courts.filter(court =>
//     court.Court?.toLowerCase().includes(search.toLowerCase())
//   );

//   const toggleSection = index => {
//     setActiveSections(prevActiveSections =>
//       prevActiveSections.includes(index)
//         ? prevActiveSections.filter(i => i !== index)
//         : [...prevActiveSections, index]
//     );
//   };

//   const toggleCollapsed = () => { // Function to toggle collapsed state
//     setIsCollapsed(!isCollapsed);
//   };

//   if (loading) {
//     return <Text>Loading...</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.placeholderImage}>
//         <Text style={styles.placeholderText}>No Image Available</Text>
//       </View>
//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search by name, city, etc."
//         value={search}
//         onChangeText={setSearch}
//       />
//       <TouchableOpacity onPress={toggleCollapsed}>
//         <Text>Show List</Text>
//       </TouchableOpacity>
//       <Collapsible collapsed={isCollapsed}>
//         <FlatList
//           data={filteredCourts}
//           renderItem={({ item, index }) => (
//             <View>
//               <TouchableOpacity
//                 style={styles.courtItem}
//                 onPress={() => toggleSection(index)}
//               >
//                 {item['Court Image'] ? (
//                   <Image
//                     source={{ uri: item['Court Image'] }} 
//                     style={styles.courtImage}
//                   />
//                 ) : (
//                   <View style={styles.placeholderImage}>
//                     <Text style={styles.placeholderText}>No Image Available</Text>
//                   </View>
//                 )}
//                 <Text>Court: {item.Court}</Text>
//                 <Text>City: {item.City}</Text>
//                 <Text>State: {item.State}</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//           keyExtractor={(item, index) => index.toString()}
//         />
//       </Collapsible>
//     </View>
//   );
// };

// export default MapsScreen;

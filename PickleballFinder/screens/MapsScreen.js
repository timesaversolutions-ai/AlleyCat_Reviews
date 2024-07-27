import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { styles } from '../styles/styles';
import { fetchCourts } from '../api/googleSheets';

const MapsScreen = ({ navigation }) => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSections, setActiveSections] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);  // New state for collapsible

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

  const toggleSection = index => {
    setActiveSections(prevActiveSections =>
      prevActiveSections.includes(index)
        ? prevActiveSections.filter(i => i !== index)
        : [...prevActiveSections, index]
    );
  };

  const toggleCollapsed = () => { // Function to toggle collapsed state
    setIsCollapsed(!isCollapsed);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.placeholderImage}>
        <Text style={styles.placeholderText}>No Image Available</Text>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name, city, etc."
        value={search}
        onChangeText={setSearch}
      />
      <TouchableOpacity onPress={toggleCollapsed}>
        <Text>{isCollapsed ? 'Show List' : 'Hide List'}</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>
        <FlatList
          data={filteredCourts}
          renderItem={({ item, index }) => (
            <View>
              <TouchableOpacity
                style={styles.courtItem}
                onPress={() => toggleSection(index)}
              >
                {item['Court Image'] ? (
                  <Image
                    source={{ uri: item['Court Image'] }} 
                    style={styles.courtImage}
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>No Image Available</Text>
                  </View>
                )}
                <Text>Court: {item.Court}</Text>
                <Text>City: {item.City}</Text>
                <Text>State: {item.State}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </Collapsible>
    </View>
  );
};

export default MapsScreen;


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

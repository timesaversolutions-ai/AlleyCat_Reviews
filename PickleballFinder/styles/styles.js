import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 20,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  courtItem: {
    padding: 10,
  },
  homeScreenCourtImage: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 300,
    borderRadius: 25,
  },
  mapsScreenCourtImage: {
    width: '25%',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: '25%',
    borderRadius: 25,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingTop: 10,
  },
  detailHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 3,
    paddingTop: 20,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 1,
    marginBottom: 3,
    paddingBottom: 15,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 15,
    borderBottomWidth: .5,
    borderColor: '#ccc',
  },
  detailKey: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
  },
  collapsibleContent: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },  
  icon: {
    marginHorizontal: 2,
  },
  mapContainer: {
    height: '50%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapsButtonContainer: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapsButtons: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 35,
    backgroundColor: '#dedede',
  },
  courtItemDetailsContainer: {
    // flexDirection: 'row',
    alignItems: 'left',
    paddingLeft: 10,
    justifyContent: 'space-between',
    paddingVertical: 10, // Add padding for better touchable area
    backgroundColor: '#fff', // Optional: background color
  },
  courtName: {
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 18,
    flex: 1,
    width: '70%',
    paddingRight: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  ratingDisplay: {
    size: 10,
    flexDirection: 'row',
  },
  detailsSection1: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  detailsSection2: {
    borderWidth: .5,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  detailLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    width: '70%',
  },
  courtItemDetailsText: {
    fontSize: 14,
    color: '#555', // Subtle color for the location text
    flexShrink: 1,
  },
  carouselImage: {
    width: '100%',
    height: 200, // Adjust the height as needed
    resizeMode: 'cover',
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 100, // Adjust based on the position of your search bar
    left: 10,
    right: 10,
    zIndex: 1000, // Ensure it appears above other components
    maxHeight: 200, // Limit the height of the suggestion box
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  suggestionItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
});


// export const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
  // searchBar: {
  //   height: 40,
  //   borderColor: 'gray',
  //   borderWidth: 1,
  //   borderRadius: 5,
  //   marginBottom: 20,
  //   paddingLeft: 10,
  // },
  // courtItem: {
  //   padding: 10,
  //   borderBottomColor: 'gray',
  //   borderBottomWidth: 1,
  // },
  // courtImage: {
  //   width: '100%',
  //   height: 200,
  //   marginBottom: 10,
  // },
  // placeholderImage: {
  //   width: '100%',
  //   height: 200,
  //   marginBottom: 10,
  //   backgroundColor: 'gray',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // placeholderText: {
  //   color: 'white',
  // },
//   detailText: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
  // detailHeader: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginTop: 12,
  //   marginBottom: 3,
  // },
// });

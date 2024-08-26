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
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
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
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  mapsButtons: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    top: 10,
    right: 10,
  },
  detailsContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 25,
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

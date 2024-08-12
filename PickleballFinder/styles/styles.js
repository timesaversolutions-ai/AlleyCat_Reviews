import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  courtItem: {
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  courtImage: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 200,
    marginBottom: 10,
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
    marginHorizontal: 5,
  },
  mapContainer: {
    height: '50%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  courtItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  detailsButton: {
    padding: 10,
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

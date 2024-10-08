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
    // marginTop: 10,
  },
  homeScreenCourtImage: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 300,
    borderRadius: 25,
  },
  mapsScreenCourtImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
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
    paddingBottom: 5, // Reduce this value from 15 to 5
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
    paddingHorizontal: 5,
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
  loginButtons: {
    padding: 10,
    width: '35%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35,
    backgroundColor: '#dedede',
    marginBottom: 15,
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
  detailsSection1: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
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
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    margin: 5,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  buttonOutline: {
    marginTop: 5,
    backgroundColor: '#dedede',
    borderRadius: 40,
  },
  buttonText: {
    color: 'black',
    // fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
  },
  
  // Style for the container holding each comment
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 5,
  },
  
  // Style for the author's name in each comment
  commentAuthor: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    fontSize: 14,
  },
  imageContainer: {
    position: 'relative',
  },
  favoriteIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 5,
  },
  commentHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentCount: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
});
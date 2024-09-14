import axios from 'axios';
import { gdrive_API_KEY } from '@env';

export const findPlace = async (query) => {
  const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json`;

  try {
    const response = await axios.get(findPlaceUrl, {
      params: {
        input: encodeURIComponent(query),
        inputtype: 'textquery',
        fields: 'geometry',
        key: gdrive_API_KEY,
      },
    });

    const json = response.data;

    if (json.candidates && json.candidates.length > 0) {
      const place = json.candidates[0];
      return {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
      };
    }
  } catch (error) {
    console.error('Error finding place:', error);
  }
  return null;
};
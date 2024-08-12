import axios from 'axios';

// TODO: secure the information here, avoiding client side
const API_KEY = 'AIzaSyC-Jq692uT-dX3pGNbwbHMMd6GPANrfrg4';
const FOLDER_ID = '1uDBqazHuPyRuC_RLWUJd24kVkNu9-cAw';

// Function to fetch images from Google Drive by court name
export const fetchCourtImages = async (Court) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/drive/v3/files`,
      {
        params: {
          q: `'${FOLDER_ID}' in parents and name contains '${Court}' and mimeType contains 'image/'`,
          fields: 'files(id, name, webViewLink, webContentLink)',
          key: API_KEY,
        },
      }
    );
      

    console.log('Google Drive API Response:', response.data);
    const files = response.data.files;
    if (files.length > 0) {
      return files[0].webContentLink; // Return the first matching image
    } else {
      return null; // No matching image found
    }
  } catch (error) {
    console.error('Error fetching image from Google Drive:', error);
    throw error;
  }
};

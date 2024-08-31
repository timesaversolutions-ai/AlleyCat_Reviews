import axios from 'axios';
import { gdrive_API_KEY } from '../config';

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
          key: gdrive_API_KEY,
        },
      }
    );
      
    const files = response.data.files;
    if (files.length > 0) {
      return files.map(file => file.webContentLink); // Return an array of all matching image links
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching images from Google Drive:', error);
    throw error;
  }
};

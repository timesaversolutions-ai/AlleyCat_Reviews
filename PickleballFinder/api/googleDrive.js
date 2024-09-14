import axios from 'axios';
import { gdrive_API_KEY } from '@env';

const FOLDER_ID = '1uDBqazHuPyRuC_RLWUJd24kVkNu9-cAw';

// Function to fetch images from Google Drive by court name
export const fetchCourtImages = async (Court) => {
  let attempts = 0;
  const maxAttempts = 5; // Maximum retry attempts

  // Helper function to introduce delay between retries
  const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));

  while (attempts < maxAttempts) {
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
        return files.map(file => file.webContentLink); // Return array of image links
      } else {
        return [];
      }
    } catch (error) {
      // If the error is a rate limit (429) or network issue, retry with exponential backoff
      if (error.response?.status === 429 || error.message === 'Network Error') {
        attempts++;
        const backoffTime = Math.pow(2, attempts) * 1000; // Exponential backoff (e.g., 1000ms, 2000ms, etc.)
        console.log(`Rate limit or network error. Retrying in ${backoffTime / 1000} seconds...`);
        await delay(backoffTime); // Wait for the backoff time before retrying
      } else {
        console.error('Error fetching images from Google Drive:', error);
        throw error; // Re-throw other errors that aren't rate limits or network errors
      }
    }
  }

  // If all attempts fail, throw an error
  throw new Error('Max retries reached. Failed to fetch images.');
};

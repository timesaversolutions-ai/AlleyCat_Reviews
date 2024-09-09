import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export const fetchCourtImages = async (courtName) => {
  const imagesRef = ref(storage, 'courts');
  
  try {
    const result = await listAll(imagesRef);
    const urls = await Promise.all(
      result.items
        .filter(itemRef => itemRef.name.toLowerCase().includes(courtName.toLowerCase()))
        .map(async (itemRef) => {
          return await getDownloadURL(itemRef);
        })
    );
    return urls;
  } catch (error) {
    console.error('Error fetching images from Firebase Storage:', error);
    return [];
  }
};
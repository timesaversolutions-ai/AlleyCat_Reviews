import { collection, addDoc, doc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const addCourtToFavorites = async (userId, court) => {
  try {
    await addDoc(collection(db, 'favorites'), {
      userId,
    //   courtId: court.Court, // Assuming 'Court' is a unique identifier
      courtName: court.Court,
      city: court.City,
      state: court.State,
    //   dateAdded: new Date(),
    });
    console.log('Court added to favorites!');
  } catch (error) {
    console.error('Error adding court to favorites: ', error);
  }
};

export const removeCourtFromFavorites = async (favoriteId) => {
  try {
    await deleteDoc(doc(db, 'favorites', favoriteId));
    console.log('Court removed from favorites!');
  } catch (error) {
    console.error('Error removing court from favorites: ', error);
  }
};

export const getFavoriteCourts = async (userId) => {
  const q = query(collection(db, 'favorites'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const favoriteCourts = [];
  querySnapshot.forEach((doc) => {
    favoriteCourts.push({ id: doc.id, ...doc.data() });
  });
  return favoriteCourts;
};


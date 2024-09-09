import { db } from '../firebase'; // Firebase Firestore setup
import { collection, addDoc, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';

// Create Comment
export const addComment = async (courtName, userId, userEmail, content) => {
    await addDoc(collection(db, 'comments'), {
      courtName,
      userId,
      userEmail,
      content,
      timestamp: new Date(),
    });
  };
  
// Get Comments for a Court
export const getComments = async (courtName) => {
  const q = query(collection(db, 'comments'), where('courtName', '==', courtName));
  const querySnapshot = await getDocs(q);
  const comments = [];
  querySnapshot.forEach((doc) => {
    comments.push({ id: doc.id, ...doc.data() });
  });
  return comments;
};

// Update Comment
export const updateComment = async (commentId, content) => {
  const commentRef = doc(db, 'comments', commentId);
  await updateDoc(commentRef, { content });
};

// Delete Comment
export const deleteComment = async (commentId) => {
  const commentRef = doc(db, 'comments', commentId);
  await deleteDoc(commentRef);
};

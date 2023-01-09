import { updateProfile } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { db, storage } from "../firebase";

export const createChatDocuments = async (res, saif) => {
  try {
    const combinedId =
      res.user.uid > saif.uid
        ? res.user.uid + saif.uid
        : saif.uid + res.user.uid;
    const response = await getDoc(doc(db, "chats", combinedId));

    if (!response.exists()) {
      //create a chat in chats collection
      await setDoc(doc(db, "chats", combinedId), { messages: [] });

      await setDoc(doc(db, "userChats", res.user.uid), {});
      await updateDoc(doc(db, "userChats", res.user.uid), {
        [combinedId + ".userInfo"]: {
          uid: saif.uid,
          displayName: saif.displayName,
          photoURL: saif.photoURL,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });

      await setDoc(doc(db, "userChats", saif.uid), {});
      await updateDoc(doc(db, "userChats", saif.uid), {
        [combinedId + ".userInfo"]: {
          uid: res.user.uid,
          displayName: res.user.displayName,
          photoURL: res.user.photoURL,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });
    }
  } catch (err) {}
};

export const createUserDocuments = async (res) => {
  await setDoc(doc(db, "users", res.user.uid), {
    uid: res.user.uid,
    displayName: res.user.displayName,
    email: res.user.email,
    photoURL: res.user.photoURL,
  });
};

export const UploadProfile = (displayName, email, file, res) => {
  const date = new Date().getTime();
  const storageRef = ref(storage, `${displayName + date}`);
  uploadBytesResumable(storageRef, file).then(() => {
    getDownloadURL(storageRef).then((downloadURL) => {
      try {
        //Update profile
        updateProfile(res.user, {
          displayName,
          photoURL: downloadURL,
        });
        //create user on firestore
        setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          displayName,
          email,
          photoURL: downloadURL,
        });
      } catch (err) {}
    });
  });
};

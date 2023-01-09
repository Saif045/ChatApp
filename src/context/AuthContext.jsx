import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [saif, setSaif] = useState({
    displayName: "Saif",
    email: "seif23920@gmail.com",
    photoURL:"https://firebasestorage.googleapis.com/v0/b/chatapp-bd32d.appspot.com/o/Saif1673239250820?alt=media&token=49f73049-0d90-476b-b900-74f4ece1f192",
    uid: "iJhqmcYpIFRQ5z7uprv1t0H7Zzh1",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, saif }}>
      {children}
    </AuthContext.Provider>
  );
};

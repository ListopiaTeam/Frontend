import React from "react";
import { auth } from "./utility/firebaseApp";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const signInUser = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage({});
      setMessage({ signin: "Successfully logged in!" });
    } catch (error) {
      console.log(error);
      setMessage({ err: error.message });
    }
  };

  const logoutUser = async () => {
    await signOut(auth);
    setMessage({});
  };

  const signUpUser = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user=userCredential.user
      await sendEmailVerification(user);
      console.log("Verification email sent!");
      await updateProfile(auth.currentUser, { displayName });
      setMessage({});
      setMessage({signup: "Successful registration!"});
    } catch (error) {
      console.log(error);
      setMessage({ err: error.message });
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({});
      setMessage({ resetPassword: "Password reset email sent!" });
    } catch (error) {
      setMessage({ err: error.message });
    }
  };

  const updateCredentials = async (displayName, photoURL) => {
    try {
      if (displayName && photoURL){
        await updateProfile(auth.currentUser, { displayName, photoURL });
        console.log(photoURL);
      }
      else if (displayName)
        await updateProfile(auth.currentUser, { displayName });
      else if (photoURL)
        await updateProfile(auth.currentUser, { photoURL });
      setMessage({});
      setMessage({ update: "sikeres modositas!" });
    } catch (error) {
      console.log(error);
      setMessage({ err: error.message });
    }
  };

  const deleteAccount=async()=>{
    try {
      await deleteUser(auth.currentUser)
      console.log('sikeres torles!');
      
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        signInUser,
        logoutUser,
        signUpUser,
        resetPassword,
        message,
        setMessage,
        updateCredentials,
        deleteAccount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

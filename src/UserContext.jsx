import React from "react";
import { auth, db } from "./utility/firebaseApp";
import {
	createUserWithEmailAndPassword,
	deleteUser,
	GoogleAuthProvider,
	onAuthStateChanged,
	sendEmailVerification,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	updateProfile,
} from "firebase/auth";
import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(undefined);
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
			setMessage({ signin: "Successfully logged in!" });
		} catch (error) {
			
			setMessage({ err: error.message });
			setTimeout(() => {
				setMessage({ err: "" });
			}, 5000);
		}
	};

	const logoutUser = async () => {
		await signOut(auth);
		setMessage({});
	};

	const signUpUser = async (email, password, displayName) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);
			const user = userCredential.user;

			await sendEmailVerification(user);
			await updateProfile(user, { displayName });
			await setDoc(doc(db, "Users", user.uid), {
				uid: user.uid,
				displayName: displayName,
				email: email,
				photoURL: "",
				createdAt: new Date(),
			});

			setMessage({ signup: "Successful registration!" });
		} catch (error) {
			console.error(error);
			setMessage({ err: error.message });
			setTimeout(() => {
				setMessage({ err: "" });
			}, 5000);
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
			const updateData = {};
			if (displayName) updateData.displayName = displayName;
			if (photoURL) updateData.photoURL = photoURL;

			if (Object.keys(updateData).length > 0) {
				await updateProfile(auth.currentUser, updateData);
			}

			const userDocRef = doc(db, "Users", auth.currentUser.uid);
			await updateDoc(userDocRef, updateData);

			setMessage({ update: "Successful update!" });
		} catch (error) {
			console.error(error);
			setMessage({ err: error.message });
		}
	};

	const deleteAccount = async () => {
		const userDocRef = doc(db, "Users", auth.currentUser.uid);
		try {
			await deleteDoc(userDocRef);
			await deleteUser(auth.currentUser);
		} catch (error) {
			console.log(error);
		}
	};

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

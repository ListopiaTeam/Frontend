import { db } from "./firebaseApp";
import { collection, getDocs } from "firebase/firestore";

/**
 * Generates a simple schema for a Firestore collection.
 * @param {string} collectionPath - The Firestore path (e.g., 'users' or 'users/userId/posts').
 * @returns {Promise<Object>} - A schema object with key:type mappings.
 */
export const generateSchema = async (collectionPath) => {
	try {
		const collectionRef = collection(db, collectionPath);
		const snapshot = await getDocs(collectionRef);

		const schema = {};

		snapshot.docs.forEach((doc) => {
			const data = doc.data();
			Object.keys(data).forEach((key) => {
				const value = data[key];
				const type = Array.isArray(value)
					? "array"
					: value === null
						? "null"
						: typeof value;

				// Avoid overriding if field already exists with same type
				if (!schema[key]) {
					schema[key] = { type };
				}
			});
		});

		console.log(`Schema for ${collectionPath}:`, schema);
		return schema;
	} catch (error) {
		console.error(`Error fetching schema for ${collectionPath}:`, error);
		return {};
	}
};

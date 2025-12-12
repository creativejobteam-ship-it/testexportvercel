
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Creates a new Client in the sub-collection: users/{agencyId}/clients
 */
export const createClient = async (
  agencyId: string, 
  clientData: { 
    name: string; 
    domain: string; 
    website?: string; 
    logoUrl?: string; 
  }
) => {
  if (!agencyId) throw new Error("Agency ID is required");

  // Reference: users -> {uid} -> clients
  const clientsRef = collection(db, "users", agencyId, "clients");

  try {
    const docRef = await addDoc(clientsRef, {
      ...clientData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      questionnaireStatus: 'not_sent', // Default state
      autopilotExcluded: false
    });
    
    console.log("Client created with ID: ", docRef.id);
    return { id: docRef.id, ...clientData };
  } catch (e) {
    console.error("Error adding client: ", e);
    throw e;
  }
};

/**
 * Initialize Agency User Profile upon first login
 */
export const syncUserProfile = async (user: any) => {
    if (!user) return;
    
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        // Create new
        await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            subscriptionTier: 'free'
        });
    } else {
        // Update login time
        await setDoc(userRef, {
            lastLogin: serverTimestamp()
        }, { merge: true });
    }
};

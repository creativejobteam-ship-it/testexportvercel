
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy, where } from "firebase/firestore";
import { Client, Project, Strategy, BriefingRecord } from "../../types";

/**
 * Creates a new Client in the sub-collection: users/{agencyId}/clients
 */
export const createClient = async (
  agencyId: string, 
  clientData: Partial<Client>
) => {
  if (!agencyId) throw new Error("Agency ID is required");
  if (!db) throw new Error("Database not initialized");

  // Reference: users -> {uid} -> clients
  const clientsRef = collection(db, "users", agencyId, "clients");

  try {
    // Remove ID if present to let Firestore generate one, or use it as doc ID
    const { id, ...dataToSave } = clientData;
    
    const docRef = await addDoc(clientsRef, {
      ...dataToSave,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      questionnaireStatus: clientData.questionnaireStatus || 'not_sent',
      autopilotExcluded: clientData.autopilotExcluded || false,
      projects: clientData.projects || []
    });
    
    return { id: docRef.id, ...clientData };
  } catch (e) {
    console.error("Error adding client: ", e);
    throw e;
  }
};

/**
 * Get all clients for a specific agency user
 */
export const getClients = async (agencyId: string): Promise<Client[]> => {
    if (!db || !agencyId) return [];

    try {
        const clientsRef = collection(db, "users", agencyId, "clients");
        const q = query(clientsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Client[];
    } catch (e) {
        console.error("Error fetching clients:", e);
        return [];
    }
};

/**
 * Get all projects by aggregating them from all clients
 * IMPORTANT: Injects clientId into the project object to ensure deletion works
 */
export const getAllProjects = async (agencyId: string): Promise<Project[]> => {
    const clients = await getClients(agencyId);
    // Flatten all projects arrays from all clients and ensure parent ID is attached
    const allProjects = clients.flatMap(client => 
        (client.projects || []).map(p => ({
            ...p,
            clientId: client.id, // Enforce parent linkage
            clientName: client.companyName // Enforce name consistency
        }))
    );
    return allProjects;
};

/**
 * Delete a specific project by removing it from the parent Client document
 * Uses standard updateDoc to modify the nested array.
 */
export const deleteProject = async (agencyId: string, clientId: string, projectId: string) => {
    if (!db) throw new Error("Database not initialized");
    if (!agencyId || !clientId || !projectId) throw new Error("Missing required IDs for deletion");

    try {
        const clientRef = doc(db, "users", agencyId, "clients", clientId);
        const clientSnap = await getDoc(clientRef);
        
        if (clientSnap.exists()) {
            const clientData = clientSnap.data() as Client;
            const currentProjects = clientData.projects || [];
            
            // Filter out the project to delete
            const updatedProjects = currentProjects.filter(p => p.id !== projectId);
            
            await updateDoc(clientRef, {
                projects: updatedProjects,
                updatedAt: serverTimestamp()
            });
        }
    } catch (e) {
        console.error("Error deleting project:", e);
        throw e;
    }
};

/**
 * Update a specific project within the parent Client document
 */
export const updateProject = async (agencyId: string, clientId: string, projectId: string, updates: Partial<Project>) => {
    if (!db) throw new Error("Database not initialized");
    if (!agencyId || !clientId || !projectId) throw new Error("Missing required IDs for update");

    try {
        const clientRef = doc(db, "users", agencyId, "clients", clientId);
        const clientSnap = await getDoc(clientRef);
        
        if (clientSnap.exists()) {
            const clientData = clientSnap.data() as Client;
            const currentProjects = clientData.projects || [];
            
            const projectIndex = currentProjects.findIndex(p => p.id === projectId);
            
            if (projectIndex > -1) {
                // Merge updates into the specific project
                currentProjects[projectIndex] = { 
                    ...currentProjects[projectIndex], 
                    ...updates 
                };
                
                await updateDoc(clientRef, {
                    projects: currentProjects,
                    updatedAt: serverTimestamp()
                });
            } else {
                throw new Error("Project not found in client document");
            }
        }
    } catch (e) {
        console.error("Error updating project:", e);
        throw e;
    }
};

/**
 * Get all strategies for a specific agency user
 */
export const getStrategies = async (agencyId: string): Promise<Strategy[]> => {
    if (!db || !agencyId) return [];

    try {
        const strategiesRef = collection(db, "users", agencyId, "strategies");
        const q = query(strategiesRef); 
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Strategy[];
    } catch (e) {
        console.error("Error fetching strategies:", e);
        return [];
    }
};

/**
 * Delete a strategy using standard deleteDoc
 */
export const deleteStrategy = async (agencyId: string, strategyId: string) => {
    if (!db) throw new Error("Database not initialized");
    try {
        await deleteDoc(doc(db, "users", agencyId, "strategies", strategyId));
    } catch (e) {
        console.error("Error deleting strategy:", e);
        throw e;
    }
};

/**
 * Get all briefs for a specific agency user
 */
export const getBriefs = async (agencyId: string): Promise<BriefingRecord[]> => {
    if (!db || !agencyId) return [];

    try {
        const myClients = await getClients(agencyId);
        const myClientIds = myClients.map(c => c.id);
        
        if (myClientIds.length === 0) return [];

        const briefsRef = collection(db, "briefs");
        const querySnapshot = await getDocs(briefsRef);
        
        const allBriefs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as BriefingRecord[];

        return allBriefs.filter(b => myClientIds.includes(b.clientId));

    } catch (e) {
        console.error("Error fetching briefs:", e);
        return [];
    }
};

/**
 * Update an existing client
 */
export const updateClient = async (agencyId: string, clientId: string, data: Partial<Client>) => {
    if (!db) throw new Error("Database not initialized");
    try {
        const clientRef = doc(db, "users", agencyId, "clients", clientId);
        const { id, ...updateData } = data;
        
        await updateDoc(clientRef, {
            ...updateData,
            updatedAt: serverTimestamp()
        });
    } catch (e) {
        console.error("Error updating client:", e);
        throw e;
    }
};

/**
 * Delete a client using standard deleteDoc
 */
export const deleteClient = async (agencyId: string, clientId: string) => {
    if (!db) throw new Error("Database not initialized");
    try {
        await deleteDoc(doc(db, "users", agencyId, "clients", clientId));
    } catch (e) {
        console.error("Error deleting client:", e);
        throw e;
    }
};

/**
 * Initialize Agency User Profile upon first login
 */
export const syncUserProfile = async (user: any) => {
    if (!user || !db) return;
    
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                subscriptionTier: 'free'
            });
        } else {
            await setDoc(userRef, {
                lastLogin: serverTimestamp()
            }, { merge: true });
        }
    } catch (e) {
        console.error("Error syncing profile:", e);
    }
};

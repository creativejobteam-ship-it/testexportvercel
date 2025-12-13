
import { BriefingRecord, BriefingStatus, Platform, ProjectContextType, BriefResponse } from '../types';
import { db } from '../src/lib/firebase';
import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs,
    updateDoc, 
    onSnapshot, 
    serverTimestamp, 
    deleteDoc,
    query,
    where
} from 'firebase/firestore';
import { triggerWorkflowStep } from './autopilotService';
import { DEMO_DATA } from './demoData';

// --- FIRESTORE COLLECTION REFERENCE ---
const COLLECTION_NAME = 'briefs';

// Hardcoded base URL for production requirement
const PRODUCTION_BASE_URL = "https://auto-cm-406582814600.us-west1.run.app";

/**
 * Creates a new Briefing Record in Firestore.
 * - Checks if a PENDING brief already exists for this project (Scenario 3).
 * - Generates URL in format: https://.../#/brief/{project_id}/{unique_token}
 */
export const createBriefingRecord = async (
    client: { id: string; name: string; email?: string },
    project: { id: string; name: string },
    config: { domainName: string; context: ProjectContextType; platforms: Platform[] },
    method: 'EMAIL' | 'MANUAL'
): Promise<BriefingRecord> => {
    
    // Check for existing pending/draft brief for this project
    if (db) {
        try {
            const q = query(
                collection(db, COLLECTION_NAME), 
                where("projectId", "==", project.id),
                where("status", "in", ["DRAFT", "SENT"])
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                // Reuse existing
                const existingDoc = querySnapshot.docs[0];
                const data = existingDoc.data() as BriefingRecord;
                console.log("Reusing existing brief:", data.id);

                // --- FIX: Force update link to use Hash Routing if it's old format ---
                const isProd = window.location.hostname !== 'localhost';
                const baseUrl = isProd ? PRODUCTION_BASE_URL : window.location.origin;
                let finalLink = data.generatedLink;

                // If link is missing the hash bang or base url changed
                if (!finalLink.includes('/#/brief/') || (isProd && !finalLink.includes(PRODUCTION_BASE_URL))) {
                     console.log("Fixing legacy link format for brief:", data.id);
                     finalLink = `${baseUrl}/#/brief/${project.id}/${data.token}`;
                     
                     // Update DB to fix it permanently
                     await updateDoc(doc(db, COLLECTION_NAME, existingDoc.id), {
                        generatedLink: finalLink
                     });
                     data.generatedLink = finalLink;
                }
                // -------------------------------------------------------------------
                
                // If method is EMAIL, update status to SENT if it was DRAFT
                if (method === 'EMAIL' && data.status === 'DRAFT') {
                    await updateDoc(doc(db, COLLECTION_NAME, existingDoc.id), {
                        status: 'SENT',
                        sentAt: serverTimestamp()
                    });
                    data.status = 'SENT';
                }
                
                // Spread data first, then override id if needed (though they should be same) to avoid TS error
                return { ...data, id: existingDoc.id };
            }
        } catch (e) {
            console.warn("Failed to check existing briefs:", e);
        }
    } else {
        // Demo mode check
        const existing = DEMO_DATA.briefs.find(b => b.projectId === project.id && b.status !== 'converted');
        if (existing) return mapResponseToRecord(existing);
    }

    // Generate a secure high-entropy token
    const token = Array.from(crypto.getRandomValues(new Uint8Array(24)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
        
    // Construct URL based on requirements: .../#/brief/{project_id}/{unique_token}
    // We use hash routing (#) to ensure the server serves index.html correctly.
    const isProd = window.location.hostname !== 'localhost';
    const baseUrl = isProd ? PRODUCTION_BASE_URL : window.location.origin;
    
    // Hash Route: /#/brief/:projectId/:token
    const link = `${baseUrl}/#/brief/${project.id}/${token}`;

    const newBriefing: BriefingRecord = {
        id: token, // Using token as ID for simplicity in Firestore
        clientId: client.id,
        clientName: client.name,
        projectId: project.id,
        projectName: project.name,
        config: config,
        status: method === 'EMAIL' ? 'SENT' : 'DRAFT',
        token: token,
        generatedLink: link,
        createdAt: new Date().toISOString(),
        answers: {}, 
        // @ts-ignore
        locked: false
    };

    // Conditionally add sentAt only if method is EMAIL to avoid undefined values in Firestore
    if (method === 'EMAIL') {
        newBriefing.sentAt = new Date().toISOString();
    }

    try {
        if (db) {
            // Strip any undefined fields before sending to Firestore
            const firestoreData = JSON.parse(JSON.stringify(newBriefing));
            
            await setDoc(doc(db, COLLECTION_NAME, token), {
                ...firestoreData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                currentFocus: null // Initialize focus
            });
        } else {
            console.warn("Firestore not available. Using local storage.");
            DEMO_DATA.briefs.push(mapRecordToResponse(newBriefing));
        }
    } catch (e) {
        console.error("Error creating brief:", e);
        throw e;
    }

    return newBriefing;
};

/**
 * Real-time subscription to a specific brief.
 */
export const subscribeToBrief = (token: string, onUpdate: (data: BriefingRecord | null) => void) => {
    if (!db) {
        // Fallback for Demo Mode
        // Logic change: In demo data, ID = token
        const demoBrief = DEMO_DATA.briefs.find(b => b.id === token);
        onUpdate(demoBrief ? mapResponseToRecord(demoBrief) : null);
        return () => {};
    }

    const unsub = onSnapshot(doc(db, COLLECTION_NAME, token), (docSnap) => {
        if (docSnap.exists()) {
            // @ts-ignore
            onUpdate({ id: docSnap.id, ...docSnap.data() } as BriefingRecord);
        } else {
            onUpdate(null);
        }
    });

    return unsub;
};

/**
 * Claim focus lock for a brief (Simulating presence)
 */
export const claimBriefingFocus = async (token: string, role: 'agency' | 'client') => {
    if (!db) return;
    const briefRef = doc(db, COLLECTION_NAME, token);
    try {
        await updateDoc(briefRef, {
            currentFocus: role,
            updatedAt: serverTimestamp()
        });
    } catch (e) {
        console.error("Failed to claim focus", e);
    }
};

/**
 * Update answers (Auto-save)
 */
export const updateBriefAnswers = async (token: string, answers: Record<string, any>) => {
    if (!db) return;
    
    const briefRef = doc(db, COLLECTION_NAME, token);
    await updateDoc(briefRef, {
        answers,
        updatedAt: serverTimestamp()
    });
};

/**
 * Lock and Validate the brief (Agency Action)
 */
export const validateBrief = async (token: string) => {
    if (!db) return;

    const briefRef = doc(db, COLLECTION_NAME, token);
    const snap = await getDoc(briefRef);
    
    if (snap.exists()) {
        const data = snap.data() as BriefingRecord;
        
        await updateDoc(briefRef, {
            status: 'COMPLETED',
            locked: true,
            completedAt: serverTimestamp()
        });

        // Trigger Autopilot
        if (data.projectId) {
            triggerWorkflowStep(data.projectId, 'BRIEF_COMPLETED');
        }
    }
};

export const getBriefings = (): BriefingRecord[] => {
    const mappedDemo = DEMO_DATA.briefs.map(mapResponseToRecord);
    return mappedDemo; 
};

// --- Helpers to map between Legacy Demo Types and New Firestore Types ---

function mapResponseToRecord(b: BriefResponse): BriefingRecord {
    // @ts-ignore
    const rawProjectName = b.projectName || b.clientName || 'Project';
    
    let status: BriefingStatus = 'SENT';
    if (b.status === 'converted') status = 'COMPLETED';
    if (b.status === 'draft') status = 'DRAFT';

    const isProd = window.location.hostname !== 'localhost';
    const baseUrl = isProd ? PRODUCTION_BASE_URL : window.location.origin;

    return {
        id: b.id,
        clientId: b.clientId,
        clientName: b.clientName || 'Unknown',
        projectId: b.projectId,
        projectName: rawProjectName,
        config: {
            domainName: b.domainName || 'General',
            context: b.projectContext || 'MAINTENANCE',
            platforms: b.targetNetworks || []
        },
        status: status,
        token: b.id, 
        generatedLink: `${baseUrl}/#/brief/${b.projectId}/${b.id}`,
        createdAt: b.submittedAt,
        answers: b.answers,
        // @ts-ignore
        locked: status === 'COMPLETED'
    };
}

function mapRecordToResponse(r: BriefingRecord): BriefResponse {
    return {
        id: r.id,
        clientId: r.clientId,
        clientName: r.clientName,
        projectId: r.projectId,
        domainId: 'gen',
        domainName: r.config.domainName,
        answers: r.answers || {},
        submittedAt: r.createdAt,
        status: r.status === 'COMPLETED' ? 'converted' : 'new',
        projectContext: r.config.context,
        targetNetworks: r.config.platforms
    };
}

export const deleteBriefing = async (id: string): Promise<void> => {
    if (db) {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    }
    // Remove from demo data too (Legacy Fallback)
    const idx = DEMO_DATA.briefs.findIndex(b => b.id === id);
    if (idx > -1) DEMO_DATA.briefs.splice(idx, 1);
};

export const updateBriefingStatus = async (id: string, status: BriefingStatus, answers?: any) => {
    if (db) {
        await updateDoc(doc(db, COLLECTION_NAME, id), {
            status,
            answers: answers || {},
            locked: status === 'COMPLETED'
        });
    }
};

export const getBriefingById = (id: string): BriefingRecord | undefined => {
    const found = DEMO_DATA.briefs.find(b => b.id === id);
    return found ? mapResponseToRecord(found) : undefined;
};

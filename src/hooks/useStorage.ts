
import { useState } from 'react';
import { storage } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface UseStorageResult {
  progress: number;
  error: string | null;
  downloadUrl: string | null;
  isUploading: boolean;
  uploadFile: (file: File, path: string) => Promise<string | null>;
}

const useStorage = (): UseStorageResult => {
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    if (!storage) {
      setError("Firebase Storage is not initialized.");
      return null;
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);

    return new Promise((resolve, reject) => {
      // Create a reference
      const storageRef = ref(storage, path);
      
      // Start upload
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        },
        (err) => {
          // Handle unsuccessful uploads
          console.error("Upload error:", err);
          setError(err.message);
          setIsUploading(false);
          reject(err);
        },
        async () => {
          // Handle successful uploads on complete
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setDownloadUrl(url);
            setIsUploading(false);
            resolve(url);
          } catch (urlErr: any) {
            console.error("Error getting download URL:", urlErr);
            setError(urlErr.message);
            setIsUploading(false);
            reject(urlErr);
          }
        }
      );
    });
  };

  return { progress, error, downloadUrl, isUploading, uploadFile };
};

export default useStorage;

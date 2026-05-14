import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

export default function useUserProfile() {
  const [userData, setUserData] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUserData(null);
        setLoadingUser(false);
        return;
      }

      const userRef = doc(db, "user", currentUser.uid);

      unsubscribeProfile = onSnapshot(userRef, (userSnap) => {
        if (userSnap.exists()) {
          setUserData({
            id: userSnap.id,
            ...userSnap.data(),
          });
        }

        setLoadingUser(false);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  return { userData, loadingUser };
}
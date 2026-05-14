import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function useUserFavorites(userId: string) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const favoritesQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      favoritesQuery,
      async (snapshot) => {
        try {
          const propertiesData = await Promise.all(
            snapshot.docs.map(async (favoriteDoc) => {
              const favoriteData = favoriteDoc.data();

              const propertyRef = doc(
                db,
                "properties",
                favoriteData.propertyId
              );

              const propertySnap = await getDoc(propertyRef);

              if (propertySnap.exists()) {
                return {
                  favoriteId: favoriteDoc.id,
                  id: propertySnap.id,
                  ...propertySnap.data(),
                };
              }

              return null;
            })
          );

          setFavorites(propertiesData.filter(Boolean));
        } catch (error) {
          console.log("Error fetching favorites:", error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.log("Favorites listener error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { favorites, loading };
}
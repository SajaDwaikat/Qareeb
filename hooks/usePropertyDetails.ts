import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function usePropertyDetails(id: string | string[] | undefined) {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (!id || typeof id !== "string") {
          setLoading(false);
          return;
        }

        const docRef = doc(db, "properties", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProperty({
            id: docSnap.id,
            ...docSnap.data(),
          });
        } else {
          setProperty(null);
        }
      } catch (error) {
        console.log("Error fetching property details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, loading };
}
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function useFirebaseProperties(type?: string) {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      let q;

      if (type === "top") {
        q = query(
          collection(db, "properties"),
          where("status", "==", "approved"),
          where("rating", ">=", 4.5),
          orderBy("rating", "desc")
        );
      } else if (type && type !== "All") {
        q = query(
          collection(db, "properties"),
          where("status", "==", "approved"),
          where("type", "==", type.toLowerCase())
        );
      } else {
        q = query(
          collection(db, "properties"),
          where("status", "==", "approved")
        );
      }

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProperties(data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [type]);

  return { properties, loading };
}
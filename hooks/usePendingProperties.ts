import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function usePendingProperties() {
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    const q = query(
      collection(db, "properties"),
      where("status", "==", "pending")
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setRequests(data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return { requests };
}
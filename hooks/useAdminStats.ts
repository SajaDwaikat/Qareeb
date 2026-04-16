import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function useAdminStats() {
  const [stats, setStats] = useState({
    users: 0,
    owners: 0,
    renters: 0,
    properties: 0,
  });

  const fetchStats = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "user"));

      const ownersQuery = query(
        collection(db, "user"),
        where("role", "==", "Property Owner")
      );
      const ownersSnapshot = await getDocs(ownersQuery);

      const rentersQuery = query(
        collection(db, "user"),
        where("role", "==", "user")
      );
      const rentersSnapshot = await getDocs(rentersQuery);

      const propertiesSnapshot = await getDocs(collection(db, "properties"));

      setStats({
        users: usersSnapshot.size,
        owners: ownersSnapshot.size,
        renters: rentersSnapshot.size,
        properties: propertiesSnapshot.size,
      });
    } catch (error) {
      console.log("Stats error:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats };
}
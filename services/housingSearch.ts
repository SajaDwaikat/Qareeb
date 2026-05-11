import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { Property } from "@/types/property";


interface Filters {
  location?: string;
  maxPrice?: number;
  type?: string;
  beds?: number;
  rooms?: number;
}

export const searchHousing = async (
  filters: Filters
): Promise<Property[]> => {
  let q = query(collection(db, "properties"));

  // 🔹 فلترة الموقع
  if (filters.location) {
    q = query(
      q,
      where("location", "==", filters.location)
    );
  }

  // 🔹 نوع السكن
  if (filters.type) {
    q = query(
      q,
      where("type", "==", filters.type)
    );
  }

  // 🔹 عدد الغرف
  if (filters.rooms) {
    q = query(
      q,
      where("rooms", ">=", filters.rooms)
    );
  }

  // 🔹 عدد الأسرة
  if (filters.beds) {
    q = query(
      q,
      where("beds", ">=", filters.beds)
    );
  }

  // 🔹 السعر (Firestore لا يدعم <= + >= مع مع بعض بسهولة)
  const snapshot = await getDocs(q);

  let results = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Property[];

  // فلترة السعر محليًا (أفضل حل عملي)
  if (filters.maxPrice) {
    results = results.filter(
      (item) => item.price <= filters.maxPrice!
    );
  }

  return results;
};
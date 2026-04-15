import {collection,getDocs,query,where,orderBy,} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type OwnerProperty = {
  id: string;
  ownerId: string;
  title: string;
  price: number;
  location: string;
  description?: string;
  status: string;
  availabilityStatus?: string;
  views?: number;
  likes?: number;
  createdAt?: any;
  images?: any;
  beds?: number;
};

export async function getOwnerProperties(ownerId: string): Promise<OwnerProperty[]> {
  const q = query(
    collection(db, "properties"),
    where("ownerId", "==", ownerId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<OwnerProperty, "id">),
  }));
}

export function buildOwnerDashboardData(properties: OwnerProperty[]) {
  const totalListings = properties.length;

  const available = properties.filter(
    (item) => item.availabilityStatus === "available"
  ).length;

  const full = properties.filter(
    (item) => item.availabilityStatus === "full"
  ).length;

  const unverified = properties.filter(
    (item) => item.status !== "approved"
  ).length;

  const recentListings = properties.slice(0, 4);

  return {
    totalListings,
    available,
    full,
    unverified,
    recentListings,
  };
}
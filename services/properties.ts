import {collection,getDocs,query,where,doc,updateDoc,deleteDoc,} from "firebase/firestore";
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
  images?: string[];
  beds?: number;
  isArchived?: boolean;
  category?: string;
  completion?: string;
};

export async function getOwnerProperties(
  ownerId: string,
  archived: boolean = false
): Promise<OwnerProperty[]> {
  const q = query(
    collection(db, "properties"),
    where("ownerId", "==", ownerId)
  );

  const snapshot = await getDocs(q);

  const properties = snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...(docItem.data() as Omit<OwnerProperty, "id">),
  }));

  const filtered = properties.filter(
    (item) => (item.isArchived ?? false) === archived
  );

  filtered.sort((a, b) => {
    const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return bTime - aTime;
  });

  return filtered;
}

export async function archiveProperty(id: string) {
  const ref = doc(db, "properties", id);

  await updateDoc(ref, {
    isArchived: true,
  });
}

export async function restoreProperty(id: string) {
  const ref = doc(db, "properties", id);

  await updateDoc(ref, {
    isArchived: false,
  });
}

export async function deleteProperty(id: string) {
  const ref = doc(db, "properties", id);
  await deleteDoc(ref);
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
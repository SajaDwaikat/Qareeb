// services/housingSearch.ts

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type Filters = {
  location?: string | null;
  type?: string | null;
  title?: string | null;
  price?: number | null;
  rating?: number | null;
  beds?: number | null;
  rooms?: number | null;
};

export async function searchHousing(filters: Filters) {
  console.log("FILTERS RECEIVED:", filters);
  const snapshot = await getDocs(collection(db, "properties"));

  const properties = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return properties.filter((property: any) => {

    const matchLocation =
      !filters.location ||
      property.location
        ?.toLowerCase()
        .includes(filters.location.toLowerCase());

  const matchType =
  !filters.type || property.type === filters.type;

    const matchTitle =
      !filters.title ||
      property.title
        ?.toLowerCase()
        .includes(filters.title.toLowerCase());

    const matchPrice =
      filters.price == null ||
      filters.price === 0 ||
      property.price <= filters.price;

    const matchRating =
      !filters.rating || property.rating >= filters.rating;

    const matchBeds =
      !filters.beds || property.beds >= filters.beds;

    const matchRooms =
      !filters.rooms || property.rooms >= filters.rooms;

    console.log("CHECK PROPERTY:", property.title);
    console.log("MATCH LOCATION:", matchLocation);
    console.log("MATCH TYPE:", matchType);
    return (
      matchLocation &&
      matchType &&
      matchTitle &&
      matchPrice &&
      matchRating &&
      matchBeds &&
      matchRooms
    );
  });
}
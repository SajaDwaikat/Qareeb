import { useState, useEffect } from "react";

export default function useProperties() {
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    setProperties([
      { id: "1", title: "Penthouse", price: 4500, rating: 4.9 },
      { id: "2", title: "Studio", price: 2000, rating: 4.7 },
      { id: "3", title: "Apartment", price: 3200, rating: 4.8 },
       { id: "4", title: "Studio", price: 2000, rating: 4.7 },
      { id: "5", title: "Apartment", price: 3200, rating: 4.8 },
       { id: "6", title: "Studio", price: 2000, rating: 4.7 },
      { id: "7", title: "Apartment", price: 3200, rating: 4.8 },
       { id: "8", title: "Studio", price: 2000, rating: 4.7 },
      { id: "10", title: "Apartment", price: 3200, rating: 4.8 },
       { id: "11", title: "Studio", price: 2000, rating: 4.7 },
      { id: "12", title: "Apartment", price: 3200, rating: 4.8 },

    ]);

  }, []);

  const featured = properties.filter((p) => p.rating >= 4.7);

  return { properties, featured };
}
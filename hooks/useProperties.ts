import { useState, useEffect } from "react";

export default function useProperties() {
  const [properties, setProperties] = useState<any[]>([]);
 
  useEffect(() => {
    setProperties([
      {
        id: "1",
        title: "Modern Apartment",
        price: 3200,
        rating: 4.8,
        location: "Al-Makhfiya, Nablus",
        type: "family",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      },
      {
        id: "2",
        title: "City Studio",
        price: 2000,
        rating: 4.6,
        location: "Old City, Nablus",
        type: "student",
        image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
      },
      {
        id: "3",
        title: "Luxury Villa",
        price: 6000,
        rating: 4.9,
        location: "Al-Makhfiya, Nablus",
        type: "family",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      },
      {
        id: "4",
        title: "Small Flat",
        price: 1500,
        rating: 4.3,
        location: "Rafidia Main St., Nablus",
        type: "student",
        image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
      },
      {
        id: "5",
        title: "Family House",
        price: 4000,
        rating: 4.7,
        location: "Al-Juneid District, Nablus",
        type: "family",
        image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
      },
      {
        id: "6",
        title: "Downtown Loft",
        price: 3500,
        rating: 4.8,
        location: "Old City, Nablus",
        type: "family",
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
      },
      {
        id: "7",
        title: "Cozy Studio",
        price: 1800,
        rating: 4.2,
        location: "University Gate, Nablus",
        type: "student",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      },
      {
        id: "8",
        title: "Modern Flat",
        price: 3000,
        rating: 4.6,
        location: "Al-Makhfiya, Nablus",
        type: "family",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
      },
      {
        id: "9",
        title: "Spacious Apartment",
        price: 4200,
        rating: 3.8,
        location: "Rafidia , Nablus",
        type: "family",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      },
      {
        id: "10",
        title: "Budget Room",
        price: 1200,
        rating: 4.2,
        location: "Rafidia Main St., Nablus",
        type: "student",
        image: "https://images.unsplash.com/photo-1554995207-c18c203602cb",
      },
    ]);
  }, []);

  // 🔥 Top Rated (Top 10)
  const topRatedProperties = properties
    .filter((p) => p.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  return { properties, topRatedProperties };
}
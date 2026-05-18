export interface Property {
  id: string;
  title: string;
  price: number;
  rating: number;
  location: string;
   type: "student" | "family"; 
  beds: number;
  rooms: number;
  image: string;

}
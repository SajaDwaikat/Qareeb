import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type FormData = {
  title: string;
  price: string;
  beds: number;
  rooms: number;
  location: string;
  description: string;
  images: string, 

};

export function useAddPropertyForm() {

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { beds: 1, rooms: 1 }
  });

  const [images, setImages] = useState<string[]>([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...uris]);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (images.length === 0) {
      alert("Add one photo at least");
      return;
    }

    try {
      const payload = {
        ...data,
        price: Number(data.price),
        images,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "properties"), payload);
      console.log("Property added!");
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    images,
    pickImage,
    onSubmit,
  };
}
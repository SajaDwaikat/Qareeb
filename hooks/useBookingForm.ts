import { useRef, useState } from "react";

import { Alert } from "react-native";

import {
  useCameraPermissions,
} from "expo-camera";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import {
  auth,
  db,
  storage,
} from "@/lib/firebase";

import {
  createNotification,
} from "@/services/notificationService";

import {
  NOTIFICATION_TYPES,
} from "@/constants/notifications";

export default function useBookingForm(
  bookingData: any
) {

  const {
    title,
    location,
    price,
    image,
    propertyId,
    ownerId,
  } = bookingData;

  const [photo, setPhoto] =
    useState<string | null>(null);

  const [showCamera, setShowCamera] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const cameraRef =
    useRef<any>(null);

  const [
    cameraPermission,
    requestCameraPermission,
  ] = useCameraPermissions();

  const openCamera = async () => {

    if (!cameraPermission?.granted) {

      await requestCameraPermission();
    }

    setShowCamera(true);
  };

  const takePhoto = async () => {

    try {

      if (cameraRef.current) {

        const photoData =
          await cameraRef.current
            .takePictureAsync();

        setPhoto(photoData.uri);

        setShowCamera(false);
      }

    } catch (error) {

      console.log(error);
    }
  };

  const uploadImage = async () => {

    if (!photo) return null;

    const response =
      await fetch(photo);

    const blob =
      await response.blob();

    const fileName =
      `bookingIDs/${Date.now()}.jpg`;

    const storageRef =
      ref(storage, fileName);

    await uploadBytes(
      storageRef,
      blob
    );

    return await getDownloadURL(
      storageRef
    );
  };

  const handleBooking =
    async (formData: any) => {

    try {

      setLoading(true);

      const imageUrl =
        await uploadImage();

      const bookingRef =
        await addDoc(
          collection(
            db,
            "bookings"
          ),
          {
            propertyId,

            apartmentName:
              title,

            userId:
              auth.currentUser?.uid
              ?? null,

            location,

            price,

            propertyImage:
              image ?? null,

            name:
              formData.name,

            phone:
              formData.phone,

            idNumber:
              formData.idNumber,

            notes:
              formData.notes || "",

            idImage:
              imageUrl,

            status: "pending",

            createdAt:
              serverTimestamp(),
          }
        );

      if (
        typeof ownerId ===
          "string" &&
        ownerId.length > 0
      ) {

        await createNotification({
          receiverId: ownerId,

          title:
            "New booking request",

          message:
            `${formData.name} requested to book ${title || "your property"}.`,

          type:
            NOTIFICATION_TYPES
              .BOOKING_REQUEST,

          relatedId:
            bookingRef.id,
        });
      }

      Alert.alert(
        "Request Submitted",
        "Your booking request has been sent successfully."
      );

      setPhoto(null);

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "Something went wrong."
      );

    } finally {

      setLoading(false);
    }
  };

  return {

    photo,
    showCamera,
    loading,

    cameraRef,

    openCamera,
    takePhoto,

    handleBooking,
  };
}
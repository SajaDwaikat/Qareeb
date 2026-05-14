import { useRef, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CameraView, useCameraPermissions } from "expo-camera";
import { updateDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function useProfileImage() {
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const saveProfileImage = async (uri: string) => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) return;

      await updateDoc(doc(db, "user", currentUser.uid), {
        image: uri,
      });

      Alert.alert("Success", "Profile photo updated");
      setShowCamera(false);
    } catch (error) {
      console.log("Error saving image:", error);
    }
  };

  const pickFromGallery = async () => {
  try {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photos"
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

    if (result.canceled) return;

    await saveProfileImage(result.assets[0].uri);
  } catch (error) {
    console.log("Error picking image:", error);
  }
};

  const openCamera = async () => {
    try {
      if (!permission?.granted) {
        const result = await requestPermission();

        if (!result.granted) {
          Alert.alert("Permission needed", "Camera permission is required");
          return;
        }
      }

      setShowCamera(true);
    } catch (error) {
      console.log("Error opening camera:", error);
    }
  };

  const takePhoto = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync();

      if (!photo?.uri) return;

      await saveProfileImage(photo.uri);
    } catch (error) {
      console.log("Error taking photo:", error);
    }
  };

  const chooseImageOption = async (type: "camera" | "gallery") => {
    if (type === "camera") {
      await openCamera();
    } else {
      await pickFromGallery();
    }
  };

  return {
    showCamera,
    setShowCamera,
    cameraRef,
    openCamera,
    takePhoto,
    pickFromGallery,
    chooseImageOption,
  };
}
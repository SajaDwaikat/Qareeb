import React, { useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {View,Text,StyleSheet,TextInput,Pressable,ScrollView,Image,Alert,ActivityIndicator,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/ui/Header";
import {CameraView,useCameraPermissions,} from "expo-camera";
import {ref,uploadBytes,getDownloadURL,} from "firebase/storage";
import {addDoc,collection,serverTimestamp,} from "firebase/firestore";
import { auth, db, storage } from "../../lib/firebase";
import { Ionicons } from "@expo/vector-icons";
import { NOTIFICATION_TYPES } from "@/constants/notifications";
import { createNotification } from "@/services/notificationService";

export default function Booking() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [notes, setNotes] = useState("");
const {title,location,price,image,propertyId,ownerId,} = useLocalSearchParams();
  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [photo, setPhoto] =
    useState<string | null>(null);
  const [showCamera, setShowCamera] =
    useState<boolean>(false);
  const [loading, setLoading] =
    useState<boolean>(false);
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
          await cameraRef.current.takePictureAsync();

        setPhoto(photoData.uri);

        setShowCamera(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async () => {
    if (!photo) return null;

    const response = await fetch(photo);

    const blob = await response.blob();

    const fileName =
      `bookingIDs/${Date.now()}.jpg`;

    const storageRef =
      ref(storage, fileName);

    await uploadBytes(storageRef, blob);

    const imageUrl =
      await getDownloadURL(storageRef);

    return imageUrl;
  };

  const handleBooking = async () => {
  try {

    if (!name || !phone || !idNumber) {
      Alert.alert(
        "Missing Information",
        "Please fill all required fields."
      );

      return;
    }

    if (idNumber.length !== 9) {
      Alert.alert(
        "Invalid ID Number",
        "ID number must contain exactly 9 digits."
      );

      return;
    }

    // if (!photo) {
    //   Alert.alert(
    //     "ID Required",
    //     "Please upload a photo of your ID."
    //   );

    //   return;
    // }
    // setLoading(true);
    // const imageUrl =
    //   await uploadImage();
    const imageUrl = null;

    const bookingRef = await addDoc(
      collection(db, "bookings"),
      {
        propertyId,apartmentName: title,
        userId: auth.currentUser?.uid ?? null,
        location,price,
        propertyImage: image ?? null,
        name,phone,idNumber,notes,
        idImage: imageUrl,
        status: "pending",
        createdAt:
          serverTimestamp(),
      }
    );

    console.log("OWNER ID:", ownerId);
    if (typeof ownerId === "string" && ownerId.length > 0) {
      try {
        await createNotification({
          receiverId: ownerId,
          title: "New booking request",
          message: `${name} requested to book ${title || "your property"}.`,
          type: NOTIFICATION_TYPES.BOOKING_REQUEST,
          relatedId: bookingRef.id,
        });
      } catch (notificationError) {
        console.log("BOOKING NOTIFICATION ERROR:", notificationError);
      }
    }
    

    Alert.alert(
      "Request Submitted",
      "Your booking request has been sent successfully. You will receive a notification once it is confirmed."
    );

    setName("");
    setPhone("");
    setIdNumber("");
    setNotes("");
    setPhoto(null);

  } catch (error) {

    console.log(
      "BOOKING ERROR:",
      error
    );

    Alert.alert(
      "Error",
      "Something went wrong. Please try again."
    );

  } finally {
    setLoading(false);
  }
  console.log("OWNER ID RAW:", ownerId);
console.log("OWNER ID TYPE:", typeof ownerId);
console.log("IS ARRAY:", Array.isArray(ownerId));
};

  if (showCamera) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
        />

        <Pressable
          onPress={takePhoto}
          style={styles.captureButton}
        >
          <Ionicons
            name="camera"
            size={30}
            color="#000"
          />
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Book Your Apartment" />

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
       

        <Text style={styles.subtitle}>
          Secure your stay in Nablus with
          our seamless booking process
        </Text>

        <View style={styles.card}>
  <Image
    source={{
      uri:
        image as string ||
        "https://via.placeholder.com/150",
    }}
    style={styles.image}
  />

  <View style={{ flex: 1 }}>
    <Text style={styles.cardTitle}>
      {title || "Apartment"}
    </Text>

   <View style={styles.locationRow}>
  <Ionicons
    name="location"
    size={16}
    color="#777"
  />
  <Text style={styles.location}>
    {location}
  </Text>
</View>

   <View style={styles.priceRow}>
  <Ionicons
    name="cash-outline"
    size={18}
    color="#007AFF"
  />

  <Text style={styles.price}>
    ₪{price}

    <Text style={styles.per}>
      {" "}
      / month
    </Text>
  </Text>
</View>
</View>
</View>

        <Text style={styles.sectionTitle}>
          1 Personal Details
        </Text>

        <Text style={styles.label}>
          Full Name
        </Text>

        <TextInput
          placeholder="Mohammad Amin"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>
          Phone Number
        </Text>

        <TextInput
          placeholder="+970 59-XXXXXXX"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="phone-pad"
        />

        <Text style={styles.sectionTitle}>
          2 Identity Verification
        </Text>

        <Text style={styles.label}>
          ID Number
        </Text>

        <TextInput
        placeholder="Enter ID or Passport Number"
        value={idNumber}
        onChangeText={(text) => {
          const cleaned =
          text.replace(/[^0-9]/g, "");
          if (cleaned.length <= 9) {
            setIdNumber(cleaned);
          }
        }}
        style={styles.input}
        keyboardType="numeric"
        maxLength={9}
        />

        <Pressable
          style={styles.uploadBox}
          onPress={openCamera}
        >
          {photo ? (
            <>
              <Image
                source={{ uri: photo }}
                style={styles.previewImage}
              />

              <Text style={styles.retake}>
                Tap to retake photo
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="camera-outline"
                size={34}
                color="#007AFF"
              />

              <Text style={styles.uploadText}>
                Upload Photo of ID
              </Text>

              <Text style={styles.uploadSub}>
                PNG, JPG up to 10MB
              </Text>
            </>
          )}
        </Pressable>

        <Text style={styles.sectionTitle}>
          3 Stay Details
        </Text>

        <Text style={styles.label}>
          Additional Notes
        </Text>

        <TextInput
          placeholder="Any specific requirements..."
          value={notes}
          onChangeText={setNotes}
          style={[
            styles.input,
            { height: 90 },
          ]}
          multiline
        />

        <Pressable
          style={styles.button}
          onPress={handleBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Submit Booking Request →
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6f8",
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
  },

  subtitle: {
    color: "#777",
    marginBottom: 20,
    marginTop: 4,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 24,
    alignItems: "center",
  },

  image: {
  width: 75,
  height: 75,
  borderRadius: 12,
  marginRight: 12,
  backgroundColor: "#ddd",
},

  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
  },


 
  per: {
    color: "#777",
    fontSize: 13,
  },

  sectionTitle: {
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 12,
    fontSize: 16,
  },

  label: {
    marginBottom: 6,
    color: "#444",
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },

  uploadBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#ccc",
  },

  uploadText: {
    fontWeight: "700",
    marginTop: 10,
  },

  uploadSub: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

  previewImage: {
    width: 170,
    height: 170,
    borderRadius: 14,
  },

  retake: {
    marginTop: 10,
    color: "#007AFF",
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 50,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  locationRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 4,
},
location: {
  color: "#777",
  fontSize: 13,
  marginLeft: 4,
},


priceRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 6,
  gap: 4,
},
price: {
  color: "#007AFF",
  fontWeight: "800",
  fontSize: 18,
  marginLeft: 4,
},

  captureButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "#fff",
    width: 80,
    height: 80,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

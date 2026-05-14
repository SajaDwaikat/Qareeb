import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Image,
  View,
  Text,
  ActivityIndicator,
  Modal,
} from "react-native";
import Header from "@/components/ui/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import useUserFavorites from "@/hooks/useUserFavorites";
import FavoritePropertyCard from "@/components/property/FavoritePropertyCard";
import { deleteDoc, doc } from "firebase/firestore";
import useUserProfile from "@/hooks/useUserProfile";
import { CameraView } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import useProfileImage from "@/hooks/useProfileImage";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
export default function Profile() {

  const { userData, loadingUser } = useUserProfile();
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const [showImageOptions, setShowImageOptions] =
  useState(false);
const currentUserId = auth.currentUser?.uid || "";
const { favorites, loading } = useUserFavorites(currentUserId);  
const { data: bookings = [] } = useQuery({
  queryKey: ["bookings"],

  queryFn: async () => {
    const currentUser =
      auth.currentUser;

    if (!currentUser) return [];

    const q = query(
      collection(db, "bookings"),

      where(
        "userId",
        "==",
        currentUser.uid
      )
    );

    const snapshot =
      await getDocs(q);

    return snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );
  },
});
const {
  showCamera,
  setShowCamera,
  cameraRef,
  takePhoto,
  chooseImageOption,
 deleteProfileImage,

} = useProfileImage();
const displayedFavorites = showAllFavorites
  ? favorites
  : favorites.slice(0, 2);

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await deleteDoc(doc(db, "favorites", favoriteId));
      console.log("Removed from favorites");
    } catch (error) {
      console.log("Error removing favorite:", error);
    }
  };

  const user = {
  name: userData?.name || "User",
  image:
    userData?.image ||
    "",
  verified: true,
  bookings: bookings.length,
  favorites: favorites.length,
};

if (showCamera) {
  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="front"
      />

      <Pressable
        onPress={takePhoto}
        style={styles.captureButton}
      >
        <Ionicons name="camera" size={30} color="#000" />
      </Pressable>

      <Pressable
        onPress={() => setShowCamera(false)}
        style={styles.closeCameraButton}
      >
        <Ionicons name="close" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Profile" />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
<View style={styles.imageWrapper}>
<Image
  source={{
    uri:
      user.image ||
    "https://api.dicebear.com/7.x/adventurer/png?seed=Rand",
  }}
  style={styles.userImage}
/>
<Pressable
  style={styles.addImageButton}
  onPress={() => setShowImageOptions(true)}
>  
<Ionicons name="add" size={22} color="#fff" />
</Pressable>
</View>
        <Text style={styles.userName}>{user.name}</Text>

        {user.verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>VERIFIED</Text>
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.bookings}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.favorites}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Favorite Properties</Text>
<Pressable onPress={() => setShowAllFavorites(!showAllFavorites)}>
  <Text style={styles.viewAll}>
    {showAllFavorites ? "Show Less" : "View All"}
  </Text>
</Pressable>
 </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0A66C2" />
        ) : favorites.length === 0 ? (
          <Text style={styles.emptyText}>No favorite properties yet.</Text>
        ) : (
          displayedFavorites.map((item) => (
            <FavoritePropertyCard
              key={item.id}
              property={item}
              onRemove={handleRemoveFavorite}
            />
          ))
        )}

<Modal
  visible={showImageOptions}
  transparent
  animationType="slide"
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>

      <Pressable
        style={styles.optionButton}
        onPress={() => {
          setShowImageOptions(false);
          chooseImageOption("camera");
        }}
      >
        <Text style={styles.optionText}>
          Camera
        </Text>
      </Pressable>

      <Pressable
        style={styles.optionButton}
       onPress={() => {
  setShowImageOptions(false);

  setTimeout(() => {
    chooseImageOption("gallery");
  }, 500);
}}
      >
        <Text style={styles.optionText}>
          Gallery
        </Text>
      </Pressable>

<Pressable
  style={styles.deleteButton}
  onPress={() => {
    setShowImageOptions(false);
    deleteProfileImage();
  }}
>
  <Text style={styles.deleteText}>
    Delete Photo
  </Text>
</Pressable>
      <Pressable
        style={styles.cancelButton}
        onPress={() =>
          setShowImageOptions(false)
        }
      >
        <Text style={styles.cancelText}>
          Cancel
        </Text>
      </Pressable>

    </View>
  </View>
</Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4F6F8",
  },

 userImage: {
  width: 110,
  height: 110,
  borderRadius: 55,
},
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#222",
    textAlign: "center",
    marginTop: 14,
  },

  verifiedBadge: {
    alignSelf: "center",
    marginTop: 8,
    backgroundColor: "#D7ECFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },

  verifiedText: {
    color: "#0B6FB3",
    fontSize: 12,
    fontWeight: "800",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
    gap: 14,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0B6FB3",
  },

  statLabel: {
    marginTop: 6,
    fontSize: 14,
    color: "#777",
    fontWeight: "600",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
  },

  viewAll: {
    fontSize: 12,
    color: "#0A66C2",
    fontWeight: "700",
  },

  emptyText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
  imageWrapper: {
  alignSelf: "center",
  marginTop: 20,
},
addImageButton: {
  position: "absolute",
  bottom: 0,
  right: 0,
  backgroundColor: "#0A66C2",
  width: 36,
  height: 36,
  borderRadius: 18,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 2,
  borderColor: "#fff",
},
modalOverlay: {
  flex: 1,
  justifyContent: "flex-end",
  backgroundColor: "rgba(0,0,0,0.4)",
},

modalContent: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
},

optionButton: {
  paddingVertical: 18,
  alignItems: "center",
},

optionText: {
  fontSize: 16,
  fontWeight: "600",
},

cancelButton: {
  marginTop: 10,
  paddingVertical: 18,
  alignItems: "center",
},

cancelText: {
  color: "red",
  fontSize: 16,
  fontWeight: "700",
},

captureButton: {
  position: "absolute",
  bottom: 50,
  alignSelf: "center",
  backgroundColor: "#fff",
  width: 85,
  height: 85,
  borderRadius: 50,
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10,
  elevation: 10,
},
closeCameraButton: {
  position: "absolute",
  top: 60,
  right: 20,
  backgroundColor: "rgba(0,0,0,0.5)",
  width: 45,
  height: 45,
  borderRadius: 25,
  justifyContent: "center",
  alignItems: "center",
},
deleteButton: {
  paddingVertical: 18,
  alignItems: "center",
},

deleteText: {
  color: "red",
  fontSize: 16,
  fontWeight: "700",
},
});
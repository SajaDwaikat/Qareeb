import React, { useState, useEffect, } from "react";
import {View,Pressable,StyleSheet, Alert,ActivityIndicator,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {addDoc,collection,getDocs,query,where,updateDoc,doc,serverTimestamp,} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function Rating({
  property,
}: any) {


  const [selectedRating, setSelectedRating] = useState(0);
   

  const [loading, setLoading] = useState(false);
    const fetchUserRating = async () => {
        const user = auth.currentUser;

  if (!user) return;
  const q = query(
    collection(db, "ratings"),

    where("propertyId","==",property.id ),
    where("userId","==",user.uid )
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {

    const ratingData =
      snapshot.docs[0].data();

    setSelectedRating(
        ratingData.rating
    );
  }
};
useEffect(() => {
  fetchUserRating();

}, [property.id]);

  const handleRating = async (
    selectedRating: number
  ) => {

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {

        Alert.alert("Login Required","Please login first"
        );

        setLoading(false);
        return;
      }


      
      setSelectedRating(selectedRating);
      const existingQuery = query(
        collection(db, "ratings"),

  where("propertyId","==",
    property.id
  ),

  where(
    "userId",
    "==",
    user.uid
  )
);

const existingSnapshot =
  await getDocs(existingQuery);

if (!existingSnapshot.empty) {

  const ratingDoc = existingSnapshot.docs[0];

  await updateDoc(
    ratingDoc.ref,
    {
      rating: selectedRating,
    }
  );

} else {

  await addDoc(
    collection(db, "ratings"),
    {
      propertyId: property.id,
      userId: user.uid,
      rating: selectedRating,
      createdAt:
        serverTimestamp(),
    }
  );
}
      
    

      const ratingsQuery = query(
        collection(db, "ratings"),
        where(
          "propertyId",
          "==",
          property.id
        )
      );

      const snapshot =
        await getDocs(ratingsQuery);

      const ratings =
        snapshot.docs.map(
          (doc) => Number(doc.data().rating)
        );

      const total =
        ratings.reduce(
          (sum, value) =>
            sum + value,
          0
        );

      const average = total / ratings.length;

      await updateDoc(
        doc(
          db,
          "properties",
          property.id
        ),
        {
          rating:
            Number(
              average.toFixed(1)
            ),

          ratingsCount:
            ratings.length,
        }
      );

      Alert.alert(
        "Success",
        "Rating submitted successfully"
      );

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <View style={styles.container}>

      {[1, 2, 3, 4, 5].map((star) => (

        <Pressable
          key={star}
          disabled={loading}
          onPress={() =>
            handleRating(star)
          }
        >

          <Ionicons
            name={
              star <= selectedRating
                ? "star"
                : "star-outline"
            }
            size={32}
            color="#f5a623"
            style={styles.star}
          />

        </Pressable>

      ))}

      {loading && (
        <ActivityIndicator
          size="small"
          color="#007AFF"
          style={styles.loader}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  star: {
    marginRight: 6,
  },

  loader: {
    marginLeft: 10,
  },
});
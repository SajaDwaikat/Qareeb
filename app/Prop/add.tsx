import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Header from "@/components/ui/Header";
import { FlatList } from "react-native";
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
type FormData = {
  title: string;
  price: string;
  beds: number;
  rooms: number;
  location: string;
  description: string;
  type: "student" | "family";
  images:string;
};
export default function AddPropertyScreen() {
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      beds: 1,
      rooms: 1,
      type: "student",
    },
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
  const priceValue = Number(data.price.trim());
  if (isNaN(priceValue)) {
    Alert.alert("Error", "Price must be a valid number");
    return;
  }
  try {
  const payload = {
  title: data.title,
  price: priceValue,
  beds: data.beds,
  rooms: data.rooms,
  location: data.location,
  description: data.description,
  images: images, 
  createdAt: new Date(),
  type: data.type,
};
await addDoc(collection(db, "properties"), payload);
Alert.alert(
      "Success",
      "Your request has been submitted successfully. It will be reviewed within 24 hours."
    );
    reset();
    setImages([]);
  } catch (err) {
    console.log("Error adding property:", err);
  }
};
  return (
  <SafeAreaView style={{ flex: 1 }}>
    <Header title="Add your property" />
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ height: 20 }} />
      <FlatList
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.topImage} />
        )}
      />
      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        <Text style={styles.uploadText}>Upload Property Photos</Text>
      </TouchableOpacity>
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <InputField
            label="Property Title"
            icon="home-outline"
            placeholder="Modern Apartment"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="price"
        render={({ field }) => (
          <InputField
            label="Price"
            icon="cash-outline"
            placeholder="$500"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />
      <Text style={styles.label}>Type</Text>
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                field.value === "student" && styles.typeActive,
              ]}
              onPress={() => field.onChange("student")}
            >
              <Text style={styles.typeText}>Student</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                field.value === "family" && styles.typeActive,
              ]}
              onPress={() => field.onChange("family")}
            >
              <Text style={styles.typeText}>Family</Text>
            </TouchableOpacity>
          </View>
        )}
      />
        <View style={styles.rowBetween}>
  <View style={{ flex: 1, marginRight: 10 }}>
    <Text style={styles.label}>Rooms</Text>
    <Controller
      control={control}
      name="rooms"
      render={({ field }) => (
        <View style={styles.counterRow}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => field.onChange(Math.max(1, field.value - 1))}
          >
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{field.value}</Text>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => field.onChange(field.value + 1)}
          >
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  </View>
  <View style={{ flex: 1 }}>
    <Text style={styles.label}>Beds</Text>
    <Controller
      control={control}
      name="beds"
      render={({ field }) => (
        <View style={styles.counterRow}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => field.onChange(Math.max(1, field.value - 1))}
          >
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{field.value}</Text>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => field.onChange(field.value + 1)}
          >
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  </View>
</View>
      <Controller
        control={control}
        name="location"
        render={({ field }) => (
          <InputField
            label="Location"
            icon="location-outline"
            placeholder="Neighborhood, Street"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />
      <Text style={styles.label}>Description</Text>
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <TextInput
            style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
            multiline
            numberOfLines={5}
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Describe your property"
          />
        )}
      />
      <Button title="Add Property" onPress={handleSubmit(onSubmit)} />
     </ScrollView>
  </SafeAreaView>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 20,
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  uploadText: {
    fontWeight: 'bold',
  },
  topImage: {
    width: 250,
    height: 150,
    borderRadius: 15,
    marginRight: 12,
  },
  label: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: '600',
  },
 rowBetween: {
  flexDirection: "row",
  alignItems: "center",
},
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtn: {
    backgroundColor: '#2D9CDB',
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    color: '#fff',
    fontSize: 20,
  },
  counterValue: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  typeActive: {
    backgroundColor: "#2D9CDB",
    borderColor: "#2D9CDB",
  },
  typeText: {
    color: "#000",
    fontWeight: "600",
  },
});

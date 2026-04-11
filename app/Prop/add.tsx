import React, { useState } from 'react';
import {
  View,Text,TextInput,TouchableOpacity,StyleSheet,ScrollView,Image,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
type FormData = {
  title: string;
  price: string;
  rooms: number;
  location: string;
  description: string;
};
export default function AddPropertyScreen() {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      rooms: 1,
    },
  });
  const [images, setImages] = useState<string[]>([]);
  const [region, setRegion] = useState({
    latitude: 31.9522,
    longitude: 35.2332,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
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
    try {
      const payload = {
        ...data,
        images,
        latitude: region.latitude,
        longitude: region.longitude,
      };
      const res = await axios.post('https://your-api.com/properties', payload);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>List Your Property</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
        {[
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
          'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
        ].map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            style={styles.topImage}
          />
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        <Text style={styles.uploadText}>Upload Property Photos</Text>
        <Text style={styles.uploadSub}>Tap to select images</Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((img, i) => (
          <Image key={i} source={{ uri: img }} style={styles.image} />
        ))}
      </ScrollView>
      <Text style={styles.label}>Property Title</Text>
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            placeholder="Modern Apartment"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />
      <Text style={styles.label}>Price per Month</Text>
      <Controller
        control={control}
        name="price"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="$500"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />
      <Text style={styles.label}>Number of Rooms</Text>
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
      <Text style={styles.label}>Location</Text>
      <Controller
        control={control}
        name="location"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            placeholder="Neighborhood, Street"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        <Marker coordinate={region} />
      </MapView>
      <Text style={styles.label}>Description</Text>
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <TextInput
            style={[styles.input, { height: 100 }]}
            multiline
            placeholder="Describe your property"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>List Property</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  uploadSub: {
    color: '#888',
    marginTop: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
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
  map: {
    height: 180,
    borderRadius: 15,
    marginTop: 10,
  },
  button: {
    marginTop: 25,
    backgroundColor: '#2D9CDB',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
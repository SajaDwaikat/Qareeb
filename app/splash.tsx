import { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Animated, {useSharedValue,useAnimatedStyle,withTiming,runOnJS,} from "react-native-reanimated";
import { router } from "expo-router";

export default function SplashScreen() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 800 }, (finished) => {
        if (finished) {
          runOnJS(goToUserType)();
        }
      });
    }, 2000);
  }, []);

  const goToUserType = () => {
    router.replace("/(auth)/user-type"); 
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.title}>Qareeb</Text>
      <Text style={styles.subtitle}>HOUSING</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCE6ED",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0A5C9F",
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 2,
    color: "#6B7C8F",
  },
});
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts } from "../styles/theme";
import MixGenie from "../assets/images/mixgenie.png";

const { width, height } = Dimensions.get("window");

const chatMessages = [
  "Ready for your magical mix?",
  "Let’s shake things up!",
  "Feeling bubbly today?",
  "How about something fruity?",
  "Let’s craft your dream drink!",
];

export default function WelcomeScreen({ navigation }) {
  const handleStart = () => {
    navigation.replace("MainApp");
  };

  const [messageIndex, setMessageIndex] = useState(0);
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(2500),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMessageIndex((prev) => (prev + 1) % chatMessages.length);
        animate();
      });
    };

    animate();
  }, []);

  return (
    <LinearGradient
      colors={["#fef6e4", "#fde2e2", "#e0f2ff"]}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View style={[styles.chatBubble, { opacity: opacityAnim }]}>
        <Text style={styles.chatText}>{chatMessages[messageIndex]}</Text>
        <View style={styles.tail} />
      </Animated.View>

      <Image source={MixGenie} style={styles.image} resizeMode="contain" />

      <Text style={styles.title}>Welcome to MixGenie!</Text>
      <Text style={styles.subtitle}>Let’s mix something magical</Text>

      <Pressable style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  chatBubble: {
    position: "absolute",
    top: height * 0.22,
    left: width * 0.20,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    maxWidth: 260,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  chatText: {
    fontFamily: fonts.regular,
    color: colors.textDark,
    fontSize: 14,
    textAlign: "center",
  },
  tail: {
    position: "absolute",
    bottom: -8,
    left: 25,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",
  },
  image: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textLight,
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: "white",
    fontFamily: fonts.bold,
    fontSize: 16,
  },
});

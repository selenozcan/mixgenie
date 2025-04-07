import React, { useState, useCallback, useRef } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Keyboard,
  Platform,
  SafeAreaView,
  Pressable,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import IngredientSelector from "../components/IngredientSelector";
import TasteSelector from "../components/TasteSelector";
import AIResponseBox from "../components/AIResponseBox";
import LoadingAnimation from "../components/LoadingAnimation";
import { colors, fonts } from "../styles/theme";
import { fetchCocktailFromGroq } from "../utils/generateCocktail";

export default function MixScreen() {
  const [spirits, setSpirits] = useState([]);
  const [extras, setExtras] = useState([]);
  const [taste, setTaste] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cocktail, setCocktail] = useState(null);
  const [outputY, setOutputY] = useState(0);

  const scrollRef = useRef();

  const screenHeight = Dimensions.get("window").height;

  useFocusEffect(
    useCallback(() => {
      setSpirits([]);
      setExtras([]);
      setTaste([]);
      //setCocktail(null);
      setIsLoading(false);
    }, [])
  );

  const handleMix = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    setCocktail(null);

    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: outputY, animated: true });
    }, 100);

    const response = await fetchCocktailFromGroq({ taste, spirits, extras });

    if (response) {
      setCocktail({ ...response, id: uuidv4() });
    } else {
      Toast.show({
        type: "error",
        text1: "Oops!",
        text2: "AI couldn't mix your drink 🥲",
        position: "bottom",
      });
    }

    setIsLoading(false);
  };

  const handleAddToFavorites = async () => {
    try {
      const existing = await AsyncStorage.getItem("favorites");
      const parsed = existing ? JSON.parse(existing) : [];

      const cocktailExists = parsed.find((item) => item.id === cocktail.id);
      if (cocktailExists) {
        Toast.show({
          type: "info",
          text1: "Already in Favorites",
          text2: `"${cocktail.name}" is already saved.`,
          position: "bottom",
        });
        return;
      }

      parsed.push(cocktail);
      await AsyncStorage.setItem("favorites", JSON.stringify(parsed));

      Toast.show({
        type: "success",
        text1: "Added to Favorites 💖",
        text2: `"${cocktail.name}" was saved.`,
        position: "bottom",
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Oops",
        text2: "Couldn't add 😢",
        position: "bottom",
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} ref={scrollRef}>
        <IngredientSelector
          spirits={spirits}
          extras={extras}
          onSpiritsChange={setSpirits}
          onExtrasChange={setExtras}
        />
        <TasteSelector selected={taste} onSelect={setTaste} />
        <Pressable style={styles.mixButton} onPress={handleMix}>
          <Text style={styles.buttonText}>🍸 Mix My Drink</Text>
        </Pressable>

        <View
          onLayout={(event) => {
            const y = event.nativeEvent.layout.y;
            setOutputY(y);
          }}
          style={[
            styles.outputBox,
            (isLoading || cocktail) && { minHeight: 400 },
          ]}
        >
          {isLoading && <LoadingAnimation />}
          {cocktail && !isLoading && (
            <AIResponseBox cocktail={cocktail} onAdd={handleAddToFavorites} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === "android" ? 50 : 0,
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
  },
  mixButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  outputBox: {
    marginTop: 30,
  },
});

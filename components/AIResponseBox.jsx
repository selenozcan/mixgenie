import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { colors, fonts } from "../styles/theme";

const cocktailImages = [
  require("../assets/images/cocktail1.png"),
  require("../assets/images/cocktail2.png"),
  require("../assets/images/cocktail3.png"),
  require("../assets/images/cocktail4.png"),
  require("../assets/images/cocktail5.png"),
];

export default function AIResponseBox({ cocktail, onAdd, onDelete }) {
  const isInFavorites = Boolean(onDelete);

  const randomImage = useMemo(() => {
    const index = Math.floor(Math.random() * cocktailImages.length);
    return cocktailImages[index];
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={randomImage} style={styles.image} resizeMode="contain" />

        <View style={styles.content}>
          <Text style={styles.name}>{cocktail.name}</Text>
          <Text style={styles.sub}>🍹 MixGenie says:</Text>
          <Text style={styles.aiDesc}>{cocktail.aiDescription}</Text>

          <Text style={styles.sub}>🧾 Ingredients:</Text>
          {cocktail.ingredients.map((item, i) => (
            <Text style={styles.ingredient} key={i}>
              • {item}
            </Text>
          ))}

          <Text style={styles.sub}>🛠️ Instructions:</Text>
          <Text style={styles.steps}>{cocktail.steps}</Text>

          <Pressable
            style={styles.favButton}
            onPress={() =>
              isInFavorites ? onDelete?.(cocktail) : onAdd?.(cocktail)
            }
          >
            <Text style={styles.favText}>
              {isInFavorites
                ? "🗑️ Remove from Favorites"
                : "💖 Add to Favorites"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    marginBottom: 15,
    borderRadius: 12,
  },
  name: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  sub: {
    fontFamily: fonts.bold,
    marginTop: 15,
    marginBottom: 5,
    color: colors.textDark,
  },
  ingredient: {
    fontFamily: fonts.regular,
  },
  steps: {
    marginTop: 5,
    fontFamily: fonts.regular,
  },
  aiDesc: {
    fontFamily: fonts.italic,
    color: colors.textLight,
  },
  favButton: {
    backgroundColor: colors.secondary,
    marginTop: 25,
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  favText: {
    color: "#fff",
    fontFamily: fonts.bold,
    lineHeight: 20,
  },
});

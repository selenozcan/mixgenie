import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AIResponseBox from "./AIResponseBox";
import { colors, fonts } from "../styles/theme";

export default function FavoriteList({ data, onDelete, search = "" }) {
  const filtered = data.filter((item) => {
    const query = search.toLowerCase();

    return (
      item.name?.toLowerCase().includes(query) ||
      item.aiDescription?.toLowerCase().includes(query) ||
      item.steps?.toLowerCase().includes(query) ||
      item.ingredients?.some((ing) => ing.toLowerCase().includes(query))
    );
  });

  const isSearching = search.trim().length > 0;

  if (filtered.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          {isSearching
            ? "No matching results found 😢"
            : "You have no favorites yet 💔"}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id || item.name}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <AIResponseBox cocktail={item} onDelete={onDelete} />
        </View>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  emptyText: {
    color: colors.textLight,
    fontFamily: fonts.italic,
  },
  item: {
    padding: 20,
  },
});

import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Platform,
  SafeAreaView,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FavoriteList from "../components/FavoriteList";
import { colors, fonts } from "../styles/theme";
import { useFocusEffect } from "@react-navigation/native";
import Toast from 'react-native-toast-message';


export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    const data = await AsyncStorage.getItem("favorites");
    setFavorites(data ? JSON.parse(data) : []);
  };

  const handleDeleteFromFavorites = async (itemToDelete) => {
    const updated = favorites.filter(
      (cocktail) => cocktail.id !== itemToDelete.id
    );
    setFavorites(updated);
    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
  
    Toast.show({
      type: "success",
      text1: "Removed from Favorites",
      text2: `"${itemToDelete.name}" has been deleted.`,
      position: "bottom",
    });
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search your cocktails..."
          placeholderTextColor={colors.textLight}
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.container}>
        <FavoriteList data={favorites} onDelete={handleDeleteFromFavorites} search={search} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  searchBox: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: fonts.regular,
    color: colors.textDark,
  },
});

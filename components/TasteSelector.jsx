import React, { useRef } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { colors, fonts } from "../styles/theme";

const tasteOptions = [
  { label: "Sweet", emoji: "🍭" },
  { label: "Fresh", emoji: "🌿" },
  { label: "Sour", emoji: "🍋" },
  { label: "Spicy", emoji: "🌶️" },
  { label: "Bitter", emoji: "🍫" },
];

export default function TasteSelector({ selected = [], onSelect }) {
  const toggleTaste = (label) => {
    if (selected.includes(label)) {
      onSelect(selected.filter((item) => item !== label));
    } else {
      onSelect([...selected, label]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>What kind of taste do you prefer?</Text>
      <View style={styles.optionsContainer}>
        {tasteOptions.map((option) => {
          const isSelected = selected.includes(option.label);
          const scaleAnim = useRef(new Animated.Value(1)).current;

          const onPressIn = () =>
            Animated.spring(scaleAnim, {
              toValue: 0.95,
              useNativeDriver: true,
            }).start();

          const onPressOut = () =>
            Animated.spring(scaleAnim, {
              toValue: 1,
              friction: 3,
              useNativeDriver: true,
            }).start();

          return (
            <Animated.View
              key={option.label}
              style={{ transform: [{ scale: scaleAnim }] }}
            >
              <Pressable
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={() => toggleTaste(option.label)}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option.emoji} {option.label}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "transparent",
    margin: 5,
  },
  optionSelected: {
    backgroundColor: colors.secondary,
  },
  optionText: {
    fontFamily: fonts.regular,
    color: colors.textDark,
    fontSize: 14,
    lineHeight: 20,
  },
  optionTextSelected: {
    fontFamily: fonts.bold,
    color: "#fff",
  },
});

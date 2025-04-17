import React, { useRef } from "react";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { colors, fonts } from "../styles/theme";

export default function OptionGrid({ data, selected, onChange }) {
  const toggle = (item) => {
    const label = item.label;
    if (selected.includes(label)) {
      onChange(selected.filter((i) => i !== label));
    } else {
      onChange([...selected, label]);
    }
  };

  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        const isSelected = selected.includes(item.label);
        const scaleAnim = useRef(new Animated.Value(1)).current;

        const onPressIn = () => {
          Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
          }).start();
        };

        const onPressOut = () => {
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
          }).start();
        };

        return (
          <Animated.View
            key={index}
            style={{ transform: [{ scale: scaleAnim }], width: "48%" }}
          >
            <Pressable
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => toggle(item)}
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
                {item.icon} {item.label}
              </Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  option: {
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: colors.secondary,
  },
  optionText: {
    fontFamily: fonts.regular,
    color: colors.textDark,
    fontSize: 15,
    lineHeight: 20,
  },
  optionTextSelected: {
    fontFamily: fonts.bold,
    color: "#fff",
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OptionGrid from './OptionGrid';
import { colors, fonts } from '../styles/theme';
import { spiritOptions, extraOptions } from '../data/ingredients';


export default function IngredientSelector({ spirits, extras, onSpiritsChange, onExtrasChange }) {
  const sortedSpiritOptions = spiritOptions.sort((a, b) => a.label.localeCompare(b.label));
  const sortedExtraOptions = extraOptions.sort((a, b) => a.label.localeCompare(b.label));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose your spirit:</Text>
      <OptionGrid
        data={sortedSpiritOptions}
        selected={spirits}
        onChange={onSpiritsChange}
      />

      <Text style={styles.label}>Add extra ingredients:</Text>
      <OptionGrid
        data={sortedExtraOptions}
        selected={extras}
        onChange={onExtrasChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 10,
  },
});

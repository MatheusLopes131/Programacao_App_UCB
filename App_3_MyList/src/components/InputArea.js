import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { PlusCircle } from 'phosphor-react-native';
import { colors } from '../theme/colors';

export function InputArea() {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Adicione algo a sua lista"
        placeholderTextColor={colors.inputPlaceholder}
      />
      <TouchableOpacity style={styles.button}>
        <PlusCircle color={colors.white} size={16} weight="bold" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    height: 54,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22.4,
  },
  button: {
    width: 52,
    height: 52,
    backgroundColor: colors.buttonBlue,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
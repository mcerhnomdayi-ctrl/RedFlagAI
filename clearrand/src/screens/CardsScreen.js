import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const CardsScreen = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="card" size={80} color={COLORS.primary} />
      <Text style={styles.title}>Cards</Text>
      <Text style={styles.subtitle}>Track your physical and virtual cards here.</Text>
      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderText}>Coming Soon: Card Management</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SPACING.md,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  placeholderCard: {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    width: '100%',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default CardsScreen;

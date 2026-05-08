import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING } from '../constants/theme';

const StatsScreen = () => {
  const { state } = useAppContext();
  const { transactions } = state;

  const currentYear = new Date().getFullYear();
  const taxYearStart = new Date(currentYear, 2, 1);
  const taxYearEnd = new Date(currentYear + 1, 1, 28);

  const taxYearTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d >= taxYearStart && d <= taxYearEnd;
  });

  const totalTaxYearSpend = taxYearTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalTaxYearIncome = taxYearTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const formatZAR = (cents) => {
    return (cents / 100).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' }).replace('ZAR', 'R');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Tax Year Report</Text>
          <Text style={styles.subtitle}>Mar {currentYear} - Feb {currentYear + 1}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Total Income</Text>
            <Text style={[styles.value, { color: COLORS.positive }]}>{formatZAR(totalTaxYearIncome)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Expenses</Text>
            <Text style={[styles.value, { color: COLORS.negative }]}>{formatZAR(totalTaxYearSpend)}</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Surplus</Text>
            <Text style={styles.totalValue}>{formatZAR(totalTaxYearIncome - totalTaxYearSpend)}</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Tip: In South Africa, you can deduct up to 27.5% of your taxable income (capped at R350,000) for retirement fund contributions.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.secondary,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.md,
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  label: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
  },
  totalRow: {
    marginTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.accent,
  },
  infoBox: {
    backgroundColor: 'rgba(94, 106, 210, 0.1)',
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default StatsScreen;

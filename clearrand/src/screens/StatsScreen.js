import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING } from '../constants/theme';

const StatsScreen = () => {
  const { state } = useAppContext();
  const { transactions } = state;

  const currentYear = new Date().getFullYear();
  const taxYearStart = new Date(currentYear, 2, 1); // March 1st
  const taxYearEnd = new Date(currentYear + 1, 1, 28); // Feb 28th/29th

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Stats</Text>
        <Text style={styles.subtitle}>SA Tax Year: Mar {currentYear} - Feb {currentYear + 1}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tax Year Summary</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total Income</Text>
          <Text style={[styles.value, { color: COLORS.accent }]}>{formatZAR(totalTaxYearIncome)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Expenses</Text>
          <Text style={[styles.value, { color: COLORS.danger }]}>{formatZAR(totalTaxYearSpend)}</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Net Surplus</Text>
          <Text style={styles.totalValue}>{formatZAR(totalTaxYearIncome - totalTaxYearSpend)}</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Tip: In South Africa, you can deduct up to 27.5% of your taxable income (capped at R350,000) for retirement fund contributions.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    color: COLORS.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  label: {
    fontSize: 16,
    color: 'gray',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalRow: {
    marginTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: SPACING.md,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
});

export default StatsScreen;

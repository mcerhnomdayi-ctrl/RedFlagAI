import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const OverviewScreen = ({ navigation }) => {
  const { state } = useAppContext();
  const { transactions, budgets, holdings, settings } = state;

  const totalInvestments = holdings.reduce((acc, h) => acc + h.valueCents, 0);
  const totalBudgetSpent = budgets.reduce((acc, b) => acc + b.spentCents, 0);
  const netWorthCents = totalInvestments; // Simplified for this view

  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlySpend = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const prevMonthSpend = transactions
    .filter(t => {
      const d = new Date(t.date);
      const now = new Date();
      return t.type === 'expense' && d.getMonth() === (now.getMonth() - 1 + 12) % 12;
    })
    .reduce((acc, t) => acc + t.amount, 0);

  const momChange = monthlySpend - prevMonthSpend;

  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlySpend) / monthlyIncome * 100).toFixed(1) : 0;

  const formatZAR = (cents) => {
    return (cents / 100).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' }).replace('ZAR', 'R');
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Ionicons name="cart-outline" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={[styles.transactionName, isDark && { color: COLORS.white }]}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: item.type === 'income' ? COLORS.accent : COLORS.danger }]}>
        {item.type === 'income' ? '+' : '-'}{formatZAR(item.amount)}
      </Text>
    </View>
  );

  const isDark = settings.darkMode;

  return (
    <View style={[styles.container, isDark && { backgroundColor: COLORS.black }]}>
      <View style={styles.header}>
        <Text style={styles.netWorthLabel}>Total Net Worth</Text>
        <Text style={styles.netWorthValue}>{formatZAR(netWorthCents)}</Text>
        <Text style={[styles.monthChange, { color: momChange <= 0 ? COLORS.accent : COLORS.danger }]}>
          {momChange <= 0 ? '-' : '+'}{formatZAR(Math.abs(momChange))} this month
        </Text>
      </View>

      <View style={styles.metricsContainer}>
        <View style={[styles.metricCard, isDark && { backgroundColor: '#333', borderColor: '#444' }]}>
          <Text style={styles.metricLabel}>Monthly Income</Text>
          <Text style={[styles.metricValue, isDark && { color: COLORS.white }]}>{formatZAR(monthlyIncome)}</Text>
        </View>
        <View style={[styles.metricCard, isDark && { backgroundColor: '#333', borderColor: '#444' }]}>
          <Text style={styles.metricLabel}>Monthly Spend</Text>
          <Text style={[styles.metricValue, isDark && { color: COLORS.white }]}>{formatZAR(monthlySpend)}</Text>
        </View>
        <View style={[styles.metricCard, isDark && { backgroundColor: '#333', borderColor: '#444' }]}>
          <Text style={styles.metricLabel}>Savings Rate</Text>
          <Text style={[styles.metricValue, isDark && { color: COLORS.white }]}>{savingsRate}%</Text>
        </View>
        <View style={[styles.metricCard, isDark && { backgroundColor: '#333', borderColor: '#444' }]}>
          <Text style={styles.metricLabel}>Investments</Text>
          <Text style={[styles.metricValue, isDark && { color: COLORS.white }]}>{formatZAR(totalInvestments)}</Text>
        </View>
      </View>

      <View style={styles.transactionsHeader}>
        <Text style={[styles.sectionTitle, isDark && { color: COLORS.white }]}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddTransaction')}>
          <Ionicons name="add-circle" size={32} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions.slice(0, 20)}
        keyExtractor={item => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  netWorthLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  netWorthValue: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: SPACING.xs,
  },
  monthChange: {
    color: COLORS.accent,
    fontSize: 14,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.sm,
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: COLORS.white,
    width: '48%',
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  metricLabel: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 12,
    color: 'gray',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: SPACING.xl,
    color: 'gray',
  },
});

export default OverviewScreen;

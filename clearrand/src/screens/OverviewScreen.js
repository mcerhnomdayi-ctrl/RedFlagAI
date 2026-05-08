import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const OverviewScreen = ({ navigation }) => {
  const { state } = useAppContext();
  const { transactions, budgets, holdings, settings } = state;

  const totalInvestments = holdings.reduce((acc, h) => acc + h.valueCents, 0);
  const netWorthCents = totalInvestments;

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
        <Ionicons
          name={item.type === 'income' ? 'arrow-down-outline' : 'cart-outline'}
          size={20}
          color={item.type === 'income' ? COLORS.positive : COLORS.textSecondary}
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionName}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: item.type === 'income' ? COLORS.positive : COLORS.text }]}>
        {item.type === 'income' ? '+' : '-'}{formatZAR(item.amount)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.netWorthLabel}>TOTAL NET WORTH</Text>
        <Text style={styles.netWorthValue}>{formatZAR(netWorthCents)}</Text>
        <View style={[styles.badge, { backgroundColor: momChange <= 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 82, 82, 0.1)' }]}>
          <Text style={[styles.monthChange, { color: momChange <= 0 ? COLORS.positive : COLORS.negative }]}>
            {momChange <= 0 ? '↓' : '↑'} {formatZAR(Math.abs(momChange))} this month
          </Text>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Income</Text>
          <Text style={styles.metricValue}>{formatZAR(monthlyIncome)}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Spend</Text>
          <Text style={styles.metricValue}>{formatZAR(monthlySpend)}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Savings</Text>
          <Text style={styles.metricValue}>{savingsRate}%</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Assets</Text>
          <Text style={styles.metricValue}>{formatZAR(totalInvestments)}</Text>
        </View>
      </View>

      <View style={styles.transactionsHeader}>
        <Text style={styles.sectionTitle}>Recent activity</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTransaction')}>
          <Ionicons name="add" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions.slice(0, 20)}
        keyExtractor={item => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  netWorthLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  netWorthValue: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: '800',
    marginVertical: SPACING.xs,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  monthChange: {
    fontSize: 13,
    fontWeight: '600',
  },
  metricsContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: COLORS.secondary,
    flex: 1,
    padding: SPACING.md,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  addButton: {
    backgroundColor: COLORS.accent,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderBottomColor: COLORS.border,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: SPACING.xl,
    color: COLORS.textSecondary,
  },
});

export default OverviewScreen;

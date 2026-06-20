import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING } from '../constants/theme';
import { APP_LIMITS } from '../constants/initialData';
import { Ionicons } from '@expo/vector-icons';
import PaywallModal from '../components/PaywallModal';

const BudgetScreen = () => {
  const { state, dispatch } = useAppContext();
  const { budgets, settings } = state;
  const [paywallVisible, setPaywallVisible] = React.useState(false);

  const formatZAR = (cents) => {
    return (cents / 100).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' }).replace('ZAR', 'R');
  };

  const getProgressColor = (spent, budget) => {
    const ratio = spent / budget;
    if (ratio > 1) return COLORS.negative;
    if (ratio > 0.8) return COLORS.amber;
    return COLORS.accent;
  };

  const renderBudgetCategory = ({ item }) => {
    const ratio = Math.min(item.spentCents / item.budgetCents, 1);
    const progressColor = getProgressColor(item.spentCents, item.budgetCents);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.budgetAmount}>
            {formatZAR(item.spentCents)} / {formatZAR(item.budgetCents)}
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${ratio * 100}%`, backgroundColor: progressColor }
            ]}
          />
        </View>
        <Text style={styles.percentageText}>{Math.round(ratio * 100)}% utilized</Text>
      </View>
    );
  };

  const handleAddCategory = () => {
    if (settings.tier === 'free' && budgets.length >= APP_LIMITS.FREE_CATEGORIES) {
      setPaywallVisible(true);
      return;
    }
    const newCat = {
      id: `cat_${Date.now()}`,
      name: 'New Category',
      budgetCents: 100000,
      spentCents: 0,
      color: COLORS.accent,
    };
    dispatch({ type: 'ADD_BUDGET', payload: newCat });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={budgets}
        keyExtractor={item => item.id}
        renderItem={renderBudgetCategory}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
            <Ionicons name="add" size={20} color={COLORS.white} />
            <Text style={styles.addButtonText}>Create category</Text>
          </TouchableOpacity>
        }
      />
      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        reason={`Free tier is limited to ${APP_LIMITS.FREE_CATEGORIES} budget categories.`}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  budgetAmount: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  progressContainer: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  percentageText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.sm,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
  },
});

export default BudgetScreen;

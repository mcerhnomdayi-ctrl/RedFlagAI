import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING } from '../constants/theme';
import { APP_LIMITS } from '../constants/initialData';
import { Ionicons } from '@expo/vector-icons';
import PaywallModal from '../components/PaywallModal';

const BudgetScreen = () => {
  const { state } = useAppContext();
  const { budgets, settings } = state;
  const [paywallVisible, setPaywallVisible] = React.useState(false);

  const formatZAR = (cents) => {
    return (cents / 100).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' }).replace('ZAR', 'R');
  };

  const getProgressColor = (spent, budget) => {
    const ratio = spent / budget;
    if (ratio > 1) return COLORS.danger;
    if (ratio > 0.8) return COLORS.amber;
    if (ratio < 0.6) return COLORS.accent;
    return COLORS.primary;
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
      color: COLORS.primary,
    };
    dispatch({ type: 'ADD_BUDGET', payload: newCat });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={budgets}
        keyExtractor={item => item.id}
        renderItem={renderBudgetCategory}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
            <Ionicons name="add" size={24} color={COLORS.primary} />
            <Text style={styles.addButtonText}>Add category</Text>
          </TouchableOpacity>
        }
      />
      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        reason={`Free tier is limited to ${APP_LIMITS.FREE_CATEGORIES} budget categories.`}
      />
    </View>
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
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  budgetAmount: {
    fontSize: 14,
    color: 'gray',
  },
  progressContainer: {
    height: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    borderRadius: 8,
    marginTop: SPACING.sm,
  },
  addButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
  },
});

export default BudgetScreen;

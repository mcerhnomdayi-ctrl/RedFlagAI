import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING } from '../constants/theme';
import { APP_LIMITS } from '../constants/initialData';
import { Ionicons } from '@expo/vector-icons';
import PaywallModal from '../components/PaywallModal';

const AddTransactionScreen = ({ navigation }) => {
  const { state, dispatch } = useAppContext();
  const { budgets } = state;

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(budgets[0]?.name || '');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paywallVisible, setPaywallVisible] = useState(false);

  const handleSave = () => {
    if (state.settings.tier === 'free') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - APP_LIMITS.FREE_HISTORY_DAYS);
      const txnDate = new Date(date);

      if (txnDate < thirtyDaysAgo) {
        setPaywallVisible(true);
        return;
      }
    }

    if (!amount || isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }

    const newTransaction = {
      id: `txn_${Date.now()}`,
      type,
      amount: parseInt(parseFloat(amount) * 100),
      currency: 'ZAR',
      category,
      description,
      date,
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, type === 'expense' && styles.activeToggleExpense]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.toggleText, type === 'expense' && styles.activeToggleText]}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, type === 'income' && styles.activeToggleIncome]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.toggleText, type === 'income' && styles.activeToggleText]}>Income</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount (R)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryList}>
            {budgets.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, category === cat.name && { backgroundColor: COLORS.accent, borderColor: COLORS.accent }]}
                onPress={() => setCategory(cat.name)}
              >
                <Text style={[styles.categoryChipText, category === cat.name && { color: COLORS.white }]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. Woolworths Food"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Create transaction</Text>
        </TouchableOpacity>
      </ScrollView>

      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        reason="Free tier is limited to the last 30 days of transactions."
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  typeToggle: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  activeToggleExpense: {
    backgroundColor: COLORS.negative,
  },
  activeToggleIncome: {
    backgroundColor: COLORS.positive,
  },
  toggleText: {
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  activeToggleText: {
    color: COLORS.white,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
    color: COLORS.white,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  categoryChipText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTransactionScreen;

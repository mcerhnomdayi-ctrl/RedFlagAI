import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
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
    <ScrollView style={styles.container}>
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
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryList}>
          {budgets.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, category === cat.name && { backgroundColor: cat.color }]}
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
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Transaction</Text>
      </TouchableOpacity>

      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        reason="Free tier is limited to the last 30 days of transactions."
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  typeToggle: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  activeToggleExpense: {
    backgroundColor: COLORS.danger,
  },
  activeToggleIncome: {
    backgroundColor: COLORS.accent,
  },
  toggleText: {
    fontWeight: 'bold',
    color: 'gray',
  },
  activeToggleText: {
    color: COLORS.white,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 14,
    color: 'gray',
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    fontSize: 16,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  categoryChipText: {
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddTransactionScreen;

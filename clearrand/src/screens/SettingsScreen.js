import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const { state, dispatch } = useAppContext();
  const { settings } = state;

  const handleExport = () => {
    if (settings.tier === 'free') {
      Alert.alert('Pro Feature', 'CSV Export is available for Pro users only.');
      return;
    }
    const headers = 'ID,Type,Amount,Currency,Category,Description,Date\n';
    const rows = state.transactions.map(t =>
      `${t.id},${t.type},${t.amount},${t.currency},"${t.category}","${t.description}",${t.date}`
    ).join('\n');
    const csvContent = headers + rows;
    Alert.alert('Export Successful', 'Transaction data exported to CSV (simulated).');
    console.log(csvContent);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Data',
      'Are you sure you want to reset all data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => dispatch({ type: 'RESET_DATA' }) },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Currency</Text>
          <Text style={styles.settingValue}>{settings.currency} (Locked)</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Budget Reset Day</Text>
          <Text style={styles.settingValue}>{settings.budgetResetDay}st of month</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={settings.darkMode}
            onValueChange={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity style={styles.settingRow} onPress={handleExport}>
          <Text style={styles.settingLabel}>Export data as CSV</Text>
          <Ionicons name="download-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRow} onPress={handleReset}>
          <Text style={[styles.settingLabel, { color: COLORS.danger }]}>Reset all data</Text>
          <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>App Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>ClearRand — Privacy First</Text>
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
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  section: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'gray',
    marginLeft: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  settingValue: {
    fontSize: 16,
    color: 'gray',
  },
  footer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  footerText: {
    color: 'gray',
    fontSize: 12,
  },
});

export default SettingsScreen;

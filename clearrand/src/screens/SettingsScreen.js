import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, SafeAreaView } from 'react-native';
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
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Currency</Text>
            <Text style={styles.settingValue}>ZAR</Text>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Reset Day</Text>
            <Text style={styles.settingValue}>1st</Text>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={settings.darkMode}
              onValueChange={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              trackColor={{ false: '#333', true: COLORS.accent }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <TouchableOpacity style={styles.settingRow} onPress={handleExport}>
            <Text style={styles.settingLabel}>Export to CSV</Text>
            <Ionicons name="download-outline" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow} onPress={handleReset}>
            <Text style={[styles.settingLabel, { color: COLORS.negative }]}>Reset system</Text>
            <Ionicons name="trash-outline" size={18} color={COLORS.negative} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>2.0.0</Text>
          </View>
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>CLEARRAND PRO V2</Text>
          <Text style={styles.footerSub}>Privacy by design. Design for privacy.</Text>
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
  header: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginLeft: SPACING.lg,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.secondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLabel: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  footer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  footerSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
    opacity: 0.6,
  },
});

export default SettingsScreen;

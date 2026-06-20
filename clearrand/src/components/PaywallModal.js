import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const PaywallModal = ({ visible, onClose, reason }) => {
  const { dispatch } = useAppContext();

  const handleUpgrade = () => {
    dispatch({ type: 'SET_TIER', payload: 'pro' });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.content}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color={COLORS.black} />
          </TouchableOpacity>

          <Ionicons name="star" size={60} color={COLORS.amber} style={styles.icon} />

          <Text style={styles.title}>Unlock ClearRand Pro</Text>
          <Text style={styles.reason}>{reason}</Text>

          <View style={styles.benefits}>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />
              <Text style={styles.benefitText}>Unlimited budget categories</Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />
              <Text style={styles.benefitText}>Unlimited portfolio holdings</Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />
              <Text style={styles.benefitText}>CSV data export</Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />
              <Text style={styles.benefitText}>Full transaction history</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Text style={styles.upgradeButtonText}>Upgrade for R79/month</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleUpgrade}>
            <Text style={styles.secondaryButtonText}>Annual: R599/year (Save 35%)</Text>
          </TouchableOpacity>

          <Text style={styles.privacyNote}>No ads. No data selling. Just pure privacy.</Text>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  icon: {
    marginVertical: SPACING.md,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  reason: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginVertical: SPACING.md,
  },
  benefits: {
    width: '100%',
    marginVertical: SPACING.lg,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  benefitText: {
    marginLeft: SPACING.sm,
    fontSize: 16,
  },
  upgradeButton: {
    backgroundColor: COLORS.accent,
    width: '100%',
    padding: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    marginTop: SPACING.md,
    padding: SPACING.md,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  privacyNote: {
    marginTop: SPACING.lg,
    fontSize: 12,
    color: 'gray',
  },
});

export default PaywallModal;

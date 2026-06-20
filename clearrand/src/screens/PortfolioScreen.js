import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING } from '../constants/theme';
import { APP_LIMITS } from '../constants/initialData';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import PaywallModal from '../components/PaywallModal';

const PortfolioScreen = () => {
  const { state, dispatch } = useAppContext();
  const { holdings, settings } = state;
  const [paywallVisible, setPaywallVisible] = React.useState(false);

  const totalPortfolioValue = holdings.reduce((acc, h) => acc + h.valueCents, 0);

  const formatZAR = (cents) => {
    return (cents / 100).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' }).replace('ZAR', 'R');
  };

  const chartData = holdings.map(h => ({
    name: h.name,
    population: h.valueCents,
    color: h.color,
    legendFontColor: COLORS.textSecondary,
    legendFontSize: 12,
  }));

  const renderHolding = (item) => (
    <View key={item.id} style={styles.holdingItem}>
      <View style={[styles.colorDot, { backgroundColor: item.color }]} />
      <View style={styles.holdingInfo}>
        <Text style={styles.holdingName}>{item.name}</Text>
        <Text style={styles.holdingPlatform}>{item.platform} • {item.allocationPct}%</Text>
      </View>
      <View style={styles.holdingValues}>
        <Text style={styles.holdingValue}>{formatZAR(item.valueCents)}</Text>
        <View style={styles.changeContainer}>
          <Ionicons
            name={item.dailyChangePct >= 0 ? 'caret-up' : 'caret-down'}
            size={12}
            color={item.dailyChangePct >= 0 ? COLORS.positive : COLORS.negative}
          />
          <Text style={[styles.changeText, { color: item.dailyChangePct >= 0 ? COLORS.positive : COLORS.negative }]}>
            {Math.abs(item.dailyChangePct)}%
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.totalLabel}>TOTAL ASSETS</Text>
          <Text style={styles.totalValue}>{formatZAR(totalPortfolioValue)}</Text>
        </View>

        <View style={styles.chartCard}>
          <PieChart
            data={chartData}
            width={Dimensions.get('window').width - SPACING.xl * 2}
            height={180}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
            hasLegend={true}
          />
        </View>

        <View style={styles.holdingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Assets</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => {
              if (settings.tier === 'free' && holdings.length >= APP_LIMITS.FREE_HOLDINGS) {
                setPaywallVisible(true);
                return;
              }
              const newHold = {
                id: `hold_${Date.now()}`,
                name: 'New Asset',
                platform: 'Satrix',
                valueCents: 100000,
                allocationPct: 0,
                dailyChangePct: 0,
                color: COLORS.accent,
              };
              dispatch({ type: 'ADD_HOLDING', payload: newHold });
            }}>
              <Ionicons name="add" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          {holdings.map(renderHolding)}
        </View>
      </ScrollView>
      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        reason={`Free tier is limited to ${APP_LIMITS.FREE_HOLDINGS} portfolio holdings.`}
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
    paddingBottom: SPACING.xl,
  },
  header: {
    padding: SPACING.lg,
    alignItems: 'flex-start',
  },
  totalLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: COLORS.secondary,
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  holdingsSection: {
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  addButton: {
    backgroundColor: COLORS.secondary,
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  holdingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.md,
  },
  holdingInfo: {
    flex: 1,
  },
  holdingName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  holdingPlatform: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  holdingValues: {
    alignItems: 'flex-end',
  },
  holdingValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
});

export default PortfolioScreen;

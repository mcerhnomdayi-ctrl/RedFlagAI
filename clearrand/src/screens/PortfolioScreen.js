import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, ScrollView } from 'react-native';
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
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  const renderHolding = ({ item }) => (
    <View style={styles.holdingItem}>
      <View style={[styles.colorDot, { backgroundColor: item.color }]} />
      <View style={styles.holdingInfo}>
        <Text style={styles.holdingName}>{item.name} ({item.allocationPct}%)</Text>
        <Text style={styles.holdingPlatform}>{item.platform}</Text>
      </View>
      <View style={styles.holdingValues}>
        <Text style={styles.holdingValue}>{formatZAR(item.valueCents)}</Text>
        <View style={styles.changeContainer}>
          <Ionicons
            name={item.dailyChangePct >= 0 ? 'arrow-up' : 'arrow-down'}
            size={12}
            color={item.dailyChangePct >= 0 ? COLORS.accent : COLORS.danger}
          />
          <Text style={[styles.changeText, { color: item.dailyChangePct >= 0 ? COLORS.accent : COLORS.danger }]}>
            {Math.abs(item.dailyChangePct)}%
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.totalLabel}>Total Portfolio Value</Text>
        <Text style={styles.totalValue}>{formatZAR(totalPortfolioValue)}</Text>
      </View>

      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={Dimensions.get('window').width - SPACING.lg * 2}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          hasLegend={false}
        />
      </View>

      <View style={styles.holdingsList}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
          <Text style={styles.sectionTitle}>Holdings</Text>
          <TouchableOpacity onPress={() => {
            if (settings.tier === 'free' && holdings.length >= APP_LIMITS.FREE_HOLDINGS) {
              setPaywallVisible(true);
              return;
            }
            const newHold = {
              id: `hold_${Date.now()}`,
              name: 'New Asset',
              platform: 'EasyEquities',
              valueCents: 100000,
              allocationPct: 0,
              dailyChangePct: 0,
              color: COLORS.accent,
            };
            dispatch({ type: 'ADD_HOLDING', payload: newHold });
          }}>
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        {holdings.map(item => (
          <View key={item.id}>
            {renderHolding({ item })}
          </View>
        ))}
      </View>
      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        reason={`Free tier is limited to ${APP_LIMITS.FREE_HOLDINGS} portfolio holdings.`}
      />
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
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  totalLabel: {
    fontSize: 14,
    color: 'gray',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  holdingsList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  holdingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.md,
  },
  holdingInfo: {
    flex: 1,
  },
  holdingName: {
    fontSize: 16,
    fontWeight: '600',
  },
  holdingPlatform: {
    fontSize: 12,
    color: 'gray',
  },
  holdingValues: {
    alignItems: 'flex-end',
  },
  holdingValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
});

export default PortfolioScreen;

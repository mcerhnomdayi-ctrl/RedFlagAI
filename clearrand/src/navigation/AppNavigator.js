import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

import OverviewScreen from '../screens/OverviewScreen';
import BudgetScreen from '../screens/BudgetScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import StatsScreen from '../screens/StatsScreen';
import CardsScreen from '../screens/CardsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';

const BottomTab = createBottomTabNavigator();
const HomeTopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function HomeTabs() {
  return (
    <HomeTopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
        tabBarStyle: { backgroundColor: COLORS.primary },
        tabBarIndicatorStyle: { backgroundColor: COLORS.accent },
        tabBarLabelStyle: { fontWeight: 'bold' },
      }}
    >
      <HomeTopTab.Screen name="Overview" component={OverviewScreen} />
      <HomeTopTab.Screen name="Budget" component={BudgetScreen} />
      <HomeTopTab.Screen name="Portfolio" component={PortfolioScreen} />
    </HomeTopTab.Navigator>
  );
}

function MainTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Stats') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Cards') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <BottomTab.Screen name="Home" component={HomeTabs} />
      <BottomTab.Screen name="Stats" component={StatsScreen} />
      <BottomTab.Screen name="Cards" component={CardsScreen} />
      <BottomTab.Screen name="Settings" component={SettingsScreen} />
    </BottomTab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{
          headerShown: true,
          title: 'Add Transaction',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
        }}
      />
    </Stack.Navigator>
  );
}

import React, { createContext, useReducer, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_BUDGET_CATEGORIES, INITIAL_HOLDINGS } from '../constants/initialData';

const AppContext = createContext();

const STORAGE_KEY = 'CLEARRAND_DATA';

const initialState = {
  transactions: [],
  budgets: INITIAL_BUDGET_CATEGORIES,
  holdings: INITIAL_HOLDINGS,
  settings: {
    tier: 'free', // 'free' or 'pro'
    darkMode: false,
    budgetResetDay: 1,
    currency: 'ZAR',
  },
  isLoaded: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...action.payload, isLoaded: true };
    case 'ADD_TRANSACTION':
      const updatedTransactions = [action.payload, ...state.transactions];
      // Update spentCents in budget if applicable
      const updatedBudgets = state.budgets.map(b => {
        if (b.name === action.payload.category && action.payload.type === 'expense') {
          return { ...b, spentCents: b.spentCents + action.payload.amount };
        }
        return b;
      });
      return { ...state, transactions: updatedTransactions, budgets: updatedBudgets };
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] };
    case 'UPDATE_BUDGET':
      return { ...state, budgets: state.budgets.map(b => b.id === action.payload.id ? action.payload : b) };
    case 'ADD_HOLDING':
      return { ...state, holdings: [...state.holdings, action.payload] };
    case 'DELETE_BUDGET':
      return { ...state, budgets: state.budgets.filter(b => b.id !== action.payload) };
    case 'DELETE_HOLDING':
      return { ...state, holdings: state.holdings.filter(h => h.id !== action.payload) };
    case 'SET_TIER':
      return { ...state, settings: { ...state.settings, tier: action.payload } };
    case 'TOGGLE_DARK_MODE':
      return { ...state, settings: { ...state.settings, darkMode: !state.settings.darkMode } };
    case 'RESET_DATA':
      return { ...initialState, isLoaded: true };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData) {
          dispatch({ type: 'LOAD_DATA', payload: JSON.parse(storedData) });
        } else {
          dispatch({ type: 'LOAD_DATA', payload: initialState });
        }
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (state.isLoaded) {
      const saveData = async () => {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
          console.error('Failed to save data', e);
        }
      };
      saveData();
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

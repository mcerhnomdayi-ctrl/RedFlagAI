export const INITIAL_BUDGET_CATEGORIES = [
  {
    id: 'cat_rent',
    name: 'Rent',
    budgetCents: 1000000,
    spentCents: 0,
    color: '#0C447C',
  },
  {
    id: 'cat_groceries',
    name: 'Groceries',
    budgetCents: 500000,
    spentCents: 0,
    color: '#BA7517',
  },
  {
    id: 'cat_transport',
    name: 'Petrol/Transport',
    budgetCents: 300000,
    spentCents: 0,
    color: '#1D9E75',
  },
  {
    id: 'cat_data',
    name: 'Data/Airtime',
    budgetCents: 50000,
    spentCents: 0,
    color: '#378ADD',
  },
  {
    id: 'cat_stokvel',
    name: 'Stokvels',
    budgetCents: 100000,
    spentCents: 0,
    color: '#A32D2D',
  },
  {
    id: 'cat_school',
    name: 'School fees',
    budgetCents: 200000,
    spentCents: 0,
    color: '#6A0DAD',
  },
];

export const INITIAL_HOLDINGS = [
  {
    id: 'hold_jse',
    name: 'JSE Top 40 ETF',
    platform: 'Satrix',
    valueCents: 1000000,
    allocationPct: 25,
    dailyChangePct: 0.5,
    color: '#378ADD',
  },
  {
    id: 'hold_sp500',
    name: 'S&P 500 Index',
    platform: 'CoreShares',
    valueCents: 1500000,
    allocationPct: 37,
    dailyChangePct: 1.2,
    color: '#1D9E75',
  },
  {
    id: 'hold_nasdaq',
    name: 'Satrix Nasdaq',
    platform: 'Satrix',
    valueCents: 800000,
    allocationPct: 20,
    dailyChangePct: -0.3,
    color: '#0C447C',
  },
  {
    id: 'hold_gold',
    name: 'Gold ETC',
    platform: 'EasyEquities',
    valueCents: 700000,
    allocationPct: 18,
    dailyChangePct: 0.1,
    color: '#BA7517',
  },
];

export const INVESTMENT_PLATFORMS = [
  'EasyEquities',
  'Satrix',
  'Old Mutual',
  'Capitec Save & Invest',
];

export const APP_LIMITS = {
  FREE_CATEGORIES: 3,
  FREE_HOLDINGS: 5,
  FREE_HISTORY_DAYS: 30,
};

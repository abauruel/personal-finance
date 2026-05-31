import type { CashFlowData, BalanceHistoryPoint } from '../api/dashboardApi';

interface PaymentCard {
  id: string;
  lastFourDigits: string;
  brand: 'VISA' | 'MASTERCARD' | 'AMEX';
  expiryDate?: string;
  holderName: string;
  isDefault?: boolean;
}

/**
 * Generates mock cash flow data for the last 12 months
 */
export function generateMockCashFlow(): CashFlowData[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();

  return months.map((month, index) => {
    // Generate realistic varying values
    const baseIn = 17000 + Math.random() * 8000;
    const baseOut = 15000 + Math.random() * 7000;

    // Make current month more prominent
    const isCurrentMonth = index === currentMonth;
    const cashIn = isCurrentMonth ? baseIn * 1.2 : baseIn;
    const cashOut = isCurrentMonth ? baseOut * 1.1 : baseOut;

    return {
      month,
      cashIn: Math.round(cashIn),
      cashOut: Math.round(cashOut),
    };
  });
}

/**
 * Generates mock balance history for the last 30 days
 */
export function generateMockBalanceHistory(): BalanceHistoryPoint[] {
  const history: BalanceHistoryPoint[] = [];
  const today = new Date();
  let currentBalance = 80000 + Math.random() * 15000;

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Add some realistic variation
    const change = (Math.random() - 0.5) * 2000;
    currentBalance += change;

    // Ensure balance doesn't go negative
    if (currentBalance < 50000) currentBalance = 50000 + Math.random() * 5000;
    if (currentBalance > 95000) currentBalance = 95000 - Math.random() * 5000;

    history.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(currentBalance),
    });
  }

  return history;
}

/**
 * Generates mock payment cards
 */
export function generateMockCards(): PaymentCard[] {
  return [
    {
      id: '1',
      lastFourDigits: '9876',
      brand: 'VISA',
      expiryDate: '08/24',
      holderName: 'Kianna Saris',
      isDefault: true,
    },
    {
      id: '2',
      lastFourDigits: '4321',
      brand: 'MASTERCARD',
      expiryDate: '12/25',
      holderName: 'Kianna Saris',
      isDefault: false,
    },
  ];
}

/**
 * Gets mock data for dashboard stats enhancement
 */
export function getMockDashboardEnhancements() {
  return {
    cashFlow: generateMockCashFlow(),
    balanceHistory: generateMockBalanceHistory(),
    cards: generateMockCards(),
  };
}

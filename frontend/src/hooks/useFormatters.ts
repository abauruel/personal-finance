import { useSettings } from '../contexts/SettingsContext';
import { formatCurrency, formatDate, formatDateTime, formatNumber, formatPercent } from '../lib/formatters';

/**
 * Custom hook that provides formatting functions based on user settings
 */
export const useFormatters = () => {
  const { settings } = useSettings();

  return {
    formatCurrency: (value: number, options?: Intl.NumberFormatOptions) =>
      formatCurrency(value, settings.currency, settings.locale, options),

    formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) =>
      formatDate(date, settings.locale, options),

    formatDateTime: (date: Date | string, options?: Intl.DateTimeFormatOptions) =>
      formatDateTime(date, settings.locale, options),

    formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(value, settings.locale, options),

    formatPercent: (value: number, options?: Intl.NumberFormatOptions) =>
      formatPercent(value, settings.locale, options),

    settings,
  };
};

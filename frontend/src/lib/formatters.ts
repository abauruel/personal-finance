import type { Currency, Locale, UserSettings } from '../types/settings.types';

/**
 * Formats a number as currency based on user settings
 */
export const formatCurrency = (
  value: number,
  currency: Currency,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency} ${value.toFixed(2)}`;
  }
};

/**
 * Formats a date based on user locale
 */
export const formatDate = (
  date: Date | string,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...options,
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};

/**
 * Formats a date with time based on user locale
 */
export const formatDateTime = (
  date: Date | string,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return String(date);
  }
};

/**
 * Formats a number based on user locale
 */
export const formatNumber = (
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...options,
    }).format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return value.toString();
  }
};

/**
 * Formats a percentage based on user locale
 */
export const formatPercent = (
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      ...options,
    }).format(value / 100);
  } catch (error) {
    console.error('Error formatting percent:', error);
    return `${value.toFixed(1)}%`;
  }
};

/**
 * Hook to get formatted currency function based on user settings
 */
export const useFormatCurrency = (settings: UserSettings) => {
  return (value: number, options?: Intl.NumberFormatOptions) =>
    formatCurrency(value, settings.currency, settings.locale, options);
};

/**
 * Hook to get formatted date function based on user settings
 */
export const useFormatDate = (settings: UserSettings) => {
  return (date: Date | string, options?: Intl.DateTimeFormatOptions) =>
    formatDate(date, settings.locale, options);
};

/**
 * Hook to get formatted number function based on user settings
 */
export const useFormatNumber = (settings: UserSettings) => {
  return (value: number, options?: Intl.NumberFormatOptions) =>
    formatNumber(value, settings.locale, options);
};

/**
 * Hook to get formatted percent function based on user settings
 */
export const useFormatPercent = (settings: UserSettings) => {
  return (value: number, options?: Intl.NumberFormatOptions) =>
    formatPercent(value, settings.locale, options);
};

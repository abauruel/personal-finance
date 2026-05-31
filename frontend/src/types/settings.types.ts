export type Currency = 'BRL' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY' | 'MXN';

export type Locale = 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE' | 'it-IT' | 'ja-JP' | 'zh-CN';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  locale: Locale;
}

export interface LocaleInfo {
  code: Locale;
  name: string;
  flag: string;
}

export interface UserSettings {
  currency: Currency;
  locale: Locale;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  firstDayOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  BRL: { code: 'BRL', symbol: 'R$', name: 'Real Brasileiro', locale: 'pt-BR' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-US' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-US' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-US' },
  CHF: { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', locale: 'de-DE' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  MXN: { code: 'MXN', symbol: '$', name: 'Mexican Peso', locale: 'es-ES' },
};

export const LOCALES: Record<Locale, LocaleInfo> = {
  'pt-BR': { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
  'en-US': { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  'es-ES': { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  'fr-FR': { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  'de-DE': { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  'it-IT': { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  'ja-JP': { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  'zh-CN': { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
};

export const DEFAULT_SETTINGS: UserSettings = {
  currency: 'BRL',
  locale: 'pt-BR',
  dateFormat: 'DD/MM/YYYY',
  firstDayOfWeek: 0,
};

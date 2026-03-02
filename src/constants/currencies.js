export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', region: 'United States' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', region: 'European Union' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', region: 'United Kingdom' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', flag: '🇨🇴', region: 'Colombia' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽', region: 'Mexico' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$', flag: '🇨🇦', region: 'Canada' },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$', flag: '🇦🇺', region: 'Australia' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', region: 'Brazil' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', flag: '🇨🇱', region: 'Chile' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', flag: '🇵🇪', region: 'Peru' },
  { code: 'CRC', name: 'Costa Rican Colón', symbol: '₡', flag: '🇨🇷', region: 'Costa Rica' },
  { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q', flag: '🇬🇹', region: 'Guatemala' },
  { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$', flag: '🇩🇴', region: 'Dominican Republic' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', region: 'Japan' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', region: 'China' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', region: 'India' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', region: 'South Korea' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭', region: 'Switzerland' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', region: 'Sweden' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', region: 'Norway' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', region: 'Denmark' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: '$', flag: '🇳🇿', region: 'New Zealand' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: '$', flag: '🇸🇬', region: 'Singapore' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: '$', flag: '🇭🇰', region: 'Hong Kong' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦', region: 'Saudi Arabia' }
]

export const DEFAULT_FROM_CURRENCY = 'USD'
export const DEFAULT_TO_CURRENCY = 'EUR'

export const getCurrencyByCode = (code) => {
  return CURRENCIES.find(c => c.code === code) || null
}

export const EXCHANGE_RATE_API_KEY = 'df549e8c-8d89-4cc5-a8bf-4eede4948897'
export const EXCHANGE_RATE_BASE_URL = 'https://api.exchangerateapi.net/v1/latest'

# CurrencyConverter Component - Documentation

## Overview

This documentation covers the `CurrencyConverter` component created for the MoneyLink project (Task TK-001-01). The component provides a currency conversion interface allowing users to convert between major international currencies used for remittances.

## Purpose

The CurrencyConverter component fulfills the requirements from User Story US-001 (Convertidor de Monedas), specifically:

- **Scenario 1**: Real-time currency conversion between two countries
- **Scenario 3**: Redirect to login when executing a transfer

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `src/constants/currencies.js` | Created | Currency constants with 25 main currencies for remittances |
| `src/components/CurrencyConverter.vue` | Created | Main converter component |
| `src/views/ConverterView.vue` | Created | Wrapper view for the converter |
| `src/router/index.js` | Modified | Added `/converter` route |
| `src/App.vue` | Modified | Added navbar with navigation |
| `src/__tests__/CurrencyConverter.spec.js` | Created | Unit tests for the component |
| `src/__tests__/documentation.md` | Created | This documentation |

## Component Features

### Input Fields
- **Amount Input**: Numeric input field for entering the amount to convert
- **From Currency Selector**: Dropdown to select source currency
- **To Currency Selector**: Dropdown to select destination currency

### Functionality
1. **Numeric Validation**: Only allows valid numeric input (integers and decimals)
2. **Currency Swap**: Button to swap source and destination currencies
3. **Real-time Conversion**: Calculates converted amount based on exchange rate
4. **Exchange Rate Display**: Shows current rate with option to refresh
5. **Updated Indicator**: Displays when the rate was last updated
6. **Execute Transfer**: Button that redirects to `/login`

### Visual Design

Following the MoneyLink design system:

| Element | Color/Value |
|---------|-------------|
| Background (cards) | `#0a1f1a` |
| Border | `#1a2e29` |
| Primary accent | `#00E676` |
| Secondary accent | `#00C853` |
| Text (headers) | `#FFFFFF` |
| Text (body) | `#A0A0A0` |
| Background (app) | `#020b08` |
| Border radius (cards) | 16px |
| Border radius (inputs) | 8px |

### Responsive Design
- Mobile-first approach
- Breakpoint at 480px for smaller adjustments
- Full width on mobile devices

## Currency Data Structure

```javascript
{
  code: 'USD',        // ISO 4217 currency code
  name: 'US Dollar',  // Full currency name
  symbol: '$',        // Currency symbol
  flag: '🇺🇸',        // Flag emoji
  region: 'United States'  // Country/region name
}
```

## 25 Currencies Included

Selected based on common remittance corridors:

1. USD 🇺🇸 - US Dollar
2. EUR 🇪🇺 - Euro
3. GBP 🇬🇧 - British Pound
4. COP 🇨🇴 - Colombian Peso
5. MXN 🇲🇽 - Mexican Peso
6. CAD 🇨🇦 - Canadian Dollar
7. AUD 🇦🇺 - Australian Dollar
8. BRL 🇧🇷 - Brazilian Real
9. CLP 🇨🇱 - Chilean Peso
10. PEN 🇵🇪 - Peruvian Sol
11. CRC 🇨🇷 - Costa Rican Colón
12. GTQ 🇬🇹 - Guatemalan Quetzal
13. DOP 🇩🇴 - Dominican Peso
14. JPY 🇯🇵 - Japanese Yen
15. CNY 🇨🇳 - Chinese Yuan
16. INR 🇮🇳 - Indian Rupee
17. KRW 🇰🇷 - South Korean Won
18. CHF 🇨🇭 - Swiss Franc
19. SEK 🇸🇪 - Swedish Krona
20. NOK 🇳🇴 - Norwegian Krone
21. DKK 🇩🇰 - Danish Krone
22. NZD 🇳🇿 - New Zealand Dollar
23. SGD 🇸🇬 - Singapore Dollar
24. HKD 🇭🇰 - Hong Kong Dollar
25. SAR 🇸🇦 - Saudi Riyal

## API Integration

The component is configured to use ExchangeRate-API:

- **Base URL**: `https://v6.exchangerate-api.com/v6`
- **API Key**: Configured in `currencies.js`
- **Note**: Full API integration will be implemented in tasks TK-001-02 and TK-001-03

Currently using mock exchange rate (0.92) as placeholder.

## Usage

### In a Vue Component

```vue
<script setup>
import CurrencyConverter from './components/CurrencyConverter.vue'
</script>

<template>
  <CurrencyConverter />
</template>
```

### Via Router

Navigate to `/converter` to access the converter view.

## Testing

Run unit tests with:

```bash
npm run test:unit
```

Tests cover:
- Component rendering with default values
- Numeric input validation
- Currency conversion calculation
- Currency swap functionality
- Dropdown options
- Exchange rate display
- Login redirect on execute
- Rate update functionality
- Updated indicator display
- Currency flag display

## Design Decisions

1. **Vanilla CSS**: Used instead of Tailwind (per project instructions)
2. **Emoji Flags**: Chosen over external images for simplicity and performance
3. **Composition API**: Used `<script setup>` for modern Vue 3 patterns
4. **Computed Properties**: Used for reactive calculations
5. **Event Handlers**: Separate functions for clarity and testability
6. **Scoped Styles**: Component-specific styling to avoid conflicts
7. **Mobile-first**: Responsive design prioritized for mobile devices

## Future Improvements (Post TK-001-01)

- [ ] TK-001-02: Create exchangeService.js for API calls
- [ ] TK-001-03: Implement real-time API integration
- [ ] TK-001-06: Add click-to-update rate functionality
- [ ] TK-001-08: Handle API errors properly
- [ ] TK-001-09: Add glassmorphism effects

## Related Tasks

| Task | Description | Status |
|------|-------------|--------|
| TK-001-01 | Create CurrencyConverter.vue with input fields and currency selection | ✅ Completed |
| TK-001-02 | Create exchangeService.js for API | Pending |
| TK-001-03 | Implement API call and dynamic rendering | Pending |
| TK-001-04 | Show flags and currency symbols | ✅ Completed |
| TK-001-05 | Validate numeric amount and country selection | ✅ Completed |
| TK-001-06 | Update rate on click | ✅ Completed |
| TK-001-07 | Execute transfer button with login redirect | ✅ Completed |
| TK-001-08 | Handle API errors | Pending |
| TK-001-09 | Add glassmorphism + responsive | Pending |
| TK-001-10 | Create E2E human test | Pending |
| TK-001-11 | Create MCP test | Pending |

## Contact

For questions or issues related to this component, refer to the project documentation in `/project-context/`.

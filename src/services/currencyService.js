import { EXCHANGE_RATE_API_KEY, EXCHANGE_RATE_BASE_URL } from '../constants/currencies'

export const currencyService = {
    async getExchangeRate(from, to) {
        try {
            if (from === to) return 1.0;

            // Base URL from constants
            const baseUrl = EXCHANGE_RATE_BASE_URL;

            // Construct URL with dynamic base and specific target currency to save bandwidth/limit
            const fetchUrl = `${baseUrl}?base=${from}&currencies=${to}`;

            const response = await fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    'apikey': EXCHANGE_RATE_API_KEY
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error Response:', errorData);

                // If the free tier doesn't allow changing the base (common error 105)
                if (response.status === 403 || errorData.code === 105 || (errorData.error && errorData.error.code === 105)) {
                    console.warn(`Base '${from}' not supported by this API plan. Attempting cross-rate calculation using USD.`);
                    return this.getCrossRate(from, to);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.rates && data.rates[to]) {
                return data.rates[to];
            } else {
                throw new Error(`Rate for ${to} not found in response`);
            }
        } catch (error) {
            console.error('Error in currencyService.getExchangeRate:', error);
            return null;
        }
    },

    async getCrossRate(from, to) {
        try {
            // Fallback: Use USD as base if the API plan restricts changing the base currency
            const baseUrl = EXCHANGE_RATE_BASE_URL;
            const fetchUrl = `${baseUrl}?base=USD&currencies=${from},${to}`;

            const response = await fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    'apikey': EXCHANGE_RATE_API_KEY
                }
            });

            if (!response.ok) throw new Error(`Cross-rate fetch failed: ${response.status}`);

            const data = await response.json();

            if (data.rates && data.rates[from] && data.rates[to]) {
                // formula: Rate(A->B) = Rate(USD->B) / Rate(USD->A)
                return data.rates[to] / data.rates[from];
            }
            return null;
        } catch (error) {
            console.error('Error in currencyService.getCrossRate:', error);
            return null;
        }
    }
}

export default currencyService;

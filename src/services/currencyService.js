import { EXCHANGE_RATE_API_KEY, EXCHANGE_RATE_BASE_URL } from '../constants/currencies'

export const currencyService = {
    async getExchangeRate(from, to) {
        try {
            if (from === to) return 1.0;

            // 1. Try primary API
            const baseUrl = EXCHANGE_RATE_BASE_URL;
            const fetchUrl = `${baseUrl}?base=${from}&currencies=${to}`;

            try {
                const response = await fetch(fetchUrl, {
                    method: 'GET',
                    headers: {
                        'apikey': EXCHANGE_RATE_API_KEY
                    }
                });

                const data = await response.json().catch(() => ({}));

                // Detecting errors even if status is 200 (common in some API plans when quota is hit)
                const isQuotaError = data.message && data.message.includes('rate limit exceeded');
                const isUnauthorized = response.status === 403 || (data.error && data.error.code === 105);

                if (response.ok && data.rates && data.rates[to]) {
                    return data.rates[to];
                }

                if (isQuotaError || isUnauthorized) {
                    console.warn(`Primary API limited or restricted for ${from}. Trying fallback API...`);
                } else if (!response.ok) {
                    throw new Error(`Primary API responded with ${response.status}`);
                }
            } catch (primaryError) {
                console.error('Primary API fetch failed:', primaryError.message);
            }

            // 2. Fallback to a reliable public API if primary fails or is limited
            // This ensures "offline mode" is only reached if everything fails
            return await this.getFallbackRate(from, to);

        } catch (error) {
            console.error('Error in currencyService.getExchangeRate:', error);
            return null;
        }
    },

    async getFallbackRate(from, to) {
        try {
            console.log(`Searching fallback for ${from} to ${to}...`);
            // open.er-api.com is a reliable free fallback that supports multiple bases
            const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);

            if (!response.ok) return null;

            const data = await response.json();
            if (data.result === 'success' && data.rates && data.rates[to]) {
                return data.rates[to];
            }
            return null;
        } catch (error) {
            console.error('Fallback API failed:', error);
            return null;
        }
    },

    async getCrossRate(from, to) {
        // Kept for backward compatibility if needed, but getExchangeRate now handles logic
        return this.getFallbackRate(from, to);
    }
}

export default currencyService;

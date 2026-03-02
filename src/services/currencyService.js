import { EXCHANGE_RATE_API_KEY, EXCHANGE_RATE_BASE_URL } from '../constants/currencies'

// small static dataset used when all network calls fail
export const STATIC_RATES = {
    USD: { EUR: 0.85, GBP: 0.75, COP: 4000 },
    EUR: { USD: 1.18, GBP: 0.88 },
    GBP: { USD: 1.33, EUR: 1.14 }
}

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
            // last resort: static table
            if (STATIC_RATES[from] && STATIC_RATES[from][to]) {
                console.warn('Using static rate fallback', from, to);
                return STATIC_RATES[from][to];
            }
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
        return this.getFallbackRate(from, to);
    },

    async getHistoricalRates(from, to, days = 30) {
        try {
            const labels = [];
            const dataPoints = [];
            const baseRate = await this.getExchangeRate(from, to);
            if (!baseRate) {
                return { labels: [], dataPoints: [] };
            }

            const now = new Date();
            const baseValue = parseFloat(baseRate);

            for (let i = days - 1; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

                // Simulate realistic historical variation
                const variance = (Math.random() - 0.5) * 0.04 * baseValue;
                const trendFactor = ((days - 1) - i) * 0.0002 * baseValue;
                const historicalRate = baseValue + variance + trendFactor;
                dataPoints.push(parseFloat(historicalRate.toFixed(4)));
            }

            return { labels, dataPoints };
        } catch (error) {
            console.error('Error fetching historical rates:', error);
            return { labels: [], dataPoints: [] };
        }
    }
}

export default currencyService;

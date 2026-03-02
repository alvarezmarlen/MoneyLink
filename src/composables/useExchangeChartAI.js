import { ref } from 'vue'

const GEMINI_API_KEY = 'AIzaSyDqGqGqGqGqGqGqGqGqGqGqGqGqGqGqGqG'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

export function useExchangeChartAI() {
    const aiResponse = ref('')
    const isLoading = ref(false)
    const error = ref(null)

    const analyzeExchangeRate = async (labels, dataPoints, currencyPair) => {
        if (!labels || !dataPoints || labels.length === 0 || dataPoints.length === 0) {
            error.value = 'No chart data available for analysis'
            return
        }

        isLoading.value = true
        error.value = null

        try {
            const currentRate = dataPoints[dataPoints.length - 1]
            const previousRate = dataPoints.length > 1 ? dataPoints[dataPoints.length - 2] : currentRate
            const highestRate = Math.max(...dataPoints)
            const lowestRate = Math.min(...dataPoints)
            const averageRate = dataPoints.reduce((a, b) => a + b, 0) / dataPoints.length

            const trend = currentRate > previousRate ? 'upward' : currentRate < previousRate ? 'downward' : 'stable'
            const changePercent = ((currentRate - previousRate) / previousRate * 100).toFixed(2)
            const rangePercent = ((highestRate - lowestRate) / lowestRate * 100).toFixed(2)

            const prompt = `You are a financial expert advisor for an international money transfer service called MoneyLink. Analyze the following exchange rate data and answer the question.

EXCHANGE RATE DATA:
- Currency Pair: ${currencyPair}
- Current Rate: ${currentRate}
- Previous Rate: ${previousRate}
- Change: ${changePercent}%
- Trend: ${trend}
- Highest Rate (period): ${highestRate}
- Lowest Rate (period): ${lowestRate}
- Average Rate: ${averageRate.toFixed(4)}
- Volatility Range: ${rangePercent}%

DATA POINTS: ${dataPoints.slice(-10).map((r, i) => `${labels[labels.length - 10 + i] || 'Day ' + (i + 1)}: ${r}`).join(', ')}

QUESTION: Is this a good time to send money?

Please respond with:
1. A clear YES or NO answer at the start
2. A brief explanation (2-3 sentences) of your reasoning based on the data
3. Keep the tone professional but friendly

Format your response in English.`

            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 300
                    }
                })
            })

            if (!response.ok) {
                throw new Error('Failed to get AI response')
            }

            const data = await response.json()

            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                aiResponse.value = data.candidates[0].content.parts[0].text
            } else {
                throw new Error('Invalid AI response format')
            }

        } catch (err) {
            console.error('AI Analysis Error:', err)
            error.value = 'AI service unavailable. Using local analysis.'
            aiResponse.value = generateLocalAnalysis(labels, dataPoints, currencyPair)
        } finally {
            isLoading.value = false
        }
    }

    const generateLocalAnalysis = (labels, dataPoints, currencyPair) => {
        const currentRate = dataPoints[dataPoints.length - 1]
        const previousRate = dataPoints.length > 1 ? dataPoints[dataPoints.length - 2] : currentRate
        const highestRate = Math.max(...dataPoints)
        const lowestRate = Math.min(...dataPoints)
        const averageRate = dataPoints.reduce((a, b) => a + b, 0) / dataPoints.length

        const changePercent = ((currentRate - previousRate) / previousRate * 100)
        const isAboveAverage = currentRate > averageRate
        const positionInRange = ((currentRate - lowestRate) / (highestRate - lowestRate)) * 100

        let recommendation = ''
        let reasoning = ''

        if (changePercent > 0.5 && isAboveAverage) {
            recommendation = 'NO'
            reasoning = `The ${currencyPair} rate is currently trending upward (${changePercent.toFixed(2)}% increase) and is above the period average. Waiting for a slight dip could save you money on your transfer.`
        } else if (changePercent < -0.5 && positionInRange < 30) {
            recommendation = 'YES'
            reasoning = `The ${currencyPair} rate is currently at a favorable position, trading below average and near the period low (${positionInRange.toFixed(0)}% from bottom). This is an excellent time to send money.`
        } else if (positionInRange > 70) {
            recommendation = 'NO'
            reasoning = `The current rate is near the high end of its recent range (${positionInRange.toFixed(0)}% from low). Consider waiting for a better rate before sending.`
        } else if (isAboveAverage && positionInRange > 50) {
            recommendation = 'NO'
            reasoning = `The ${currencyPair} rate is above average but not at its peak. There might be better opportunities in the coming days.`
        } else {
            recommendation = 'YES'
            reasoning = `The ${currencyPair} rate is trading near the average (${positionInRange.toFixed(0)}% from low), which represents a reasonable time to send money. The market appears stable.`
        }

        return `${recommendation} - ${reasoning}`
    }

    return {
        aiResponse,
        isLoading,
        error,
        analyzeExchangeRate
    }
}

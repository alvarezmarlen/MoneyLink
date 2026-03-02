<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Chart from 'chart.js/auto'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import currencyService from '../services/currencyService'
import { CURRENCIES } from '../constants/currencies'

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
)

const chartCanvas = ref(null)
let chartInstance = null
let updateInterval = null

const labels = ref([])
const dataPoints = ref([])
const currentCurrencyPair = ref('USD/EUR')
const fromCurrency = ref('USD')
const toCurrency = ref('EUR')
const isLoading = ref(false)
const isChartLoading = ref(true)

const isPositiveChange = computed(() => {
  if (dataPoints.value.length < 2) return true
  const current = dataPoints.value[dataPoints.value.length - 1]
  const previous = dataPoints.value[dataPoints.value.length - 2]
  return current >= previous
})

const fetchHistoricalData = async () => {
  isChartLoading.value = true
  try {
    const { labels: newLabels, dataPoints: newData } = await currencyService.getHistoricalRates(
      fromCurrency.value,
      toCurrency.value,
      30
    )
    labels.value = newLabels
    dataPoints.value = newData
    
    if (dataPoints.value.length > 0) {
      currentCurrencyPair.value = `${fromCurrency.value}/${toCurrency.value}`
    }
  } catch (error) {
    console.error('Error fetching historical data:', error)
  } finally {
    isChartLoading.value = false
  }
}

const initChart = () => {
  if (!chartCanvas.value) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels.value,
      datasets: [{
        label: currentCurrencyPair.value,
        data: dataPoints.value,
        borderColor: '#00E676',
        backgroundColor: 'rgba(0, 230, 118, 0.05)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#00E676',
        pointBorderColor: '#0a1f1a',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
        spanGaps: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        title: {
          display: true,
          text: 'Exchange Rate - Last 30 Days',
          color: '#FFFFFF',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: {
            bottom: 15
          }
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#A0A0A0',
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          cornerRadius: 4,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(4)}`
            }
          }
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          beginAtZero: false,
          grid: {
            color: 'rgba(200, 200, 200, 0.1)',
            drawBorder: true
          },
          ticks: {
            color: '#A0A0A0',
            callback: function(value) {
              return value.toFixed(4)
            }
          }
        },
        x: {
          type: 'category',
          display: true,
          grid: {
            display: false
          },
          ticks: {
            color: '#A0A0A0'
          }
        }
      }
    }
  })
}

const updateChart = () => {
  if (!chartInstance) return

  chartInstance.data.labels = labels.value
  chartInstance.data.datasets[0].data = dataPoints.value
  chartInstance.data.datasets[0].label = currentCurrencyPair.value
  chartInstance.update('active')
}

const updateChartData = () => {
  if (!chartInstance || dataPoints.value.length === 0) return

  const lastValue = dataPoints.value[dataPoints.value.length - 1]
  const newValue = lastValue + (Math.random() - 0.5) * 0.005

  dataPoints.value.shift()
  dataPoints.value.push(Number(newValue.toFixed(4)))

  const now = new Date()
  const newLabel = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  labels.value.shift()
  labels.value.push(newLabel)

  updateChart()
}

const handleCurrencyChange = () => {
  if (fromCurrency.value === toCurrency.value) {
    if (fromCurrency.value === 'USD') {
      toCurrency.value = 'EUR'
    } else {
      toCurrency.value = 'USD'
    }
  }
  fetchHistoricalData()
}

const refreshData = () => {
  fetchHistoricalData().then(() => {
    initChart()
    updateChart()
  })
}

onMounted(async () => {
  await fetchHistoricalData()
  
  setTimeout(() => {
    initChart()
    startRealTimeUpdates()
  }, 100)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})

const startRealTimeUpdates = () => {
  updateInterval = setInterval(() => {
    updateChartData()
  }, 5000)
}
</script>

<template>
  <div class="rates-page">
    <div class="header-section">
      <h1 class="main-title">Exchange Rates Analysis</h1>
      <p class="main-description">
        Monitor real-time exchange rates and analyze market trends to find the optimal time 
        for your international transfers. Compare currency pairs and make informed decisions.
      </p>
    </div>

    <div class="rates-grid">
      <div class="left-column">
        <div class="currency-selector-card">
          <h2 class="section-title">Select Currency Pair</h2>
          <div class="currency-selector">
            <div class="selector-group">
              <label>From</label>
              <select v-model="fromCurrency" @change="handleCurrencyChange" class="currency-select">
                <option v-for="currency in CURRENCIES" :key="currency.code" :value="currency.code">
                  {{ currency.flag }} {{ currency.code }} - {{ currency.name }}
                </option>
              </select>
            </div>

            <div class="swap-button-container">
              <button class="swap-button" @click="handleCurrencyChange" title="Swap currencies">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="17 1 21 5 17 9"></polyline>
                  <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                  <polyline points="7 23 3 19 7 15"></polyline>
                  <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                </svg>
              </button>
            </div>

            <div class="selector-group">
              <label>To</label>
              <select v-model="toCurrency" @change="handleCurrencyChange" class="currency-select">
                <option v-for="currency in CURRENCIES" :key="currency.code" :value="currency.code">
                  {{ currency.flag }} {{ currency.code }} - {{ currency.name }}
                </option>
              </select>
            </div>
          </div>

          <button class="refresh-button" @click="refreshData" :disabled="isLoading">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            Refresh Data
          </button>
        </div>

        <div class="chart-section">
          <div v-if="isChartLoading" class="chart-loading">
            <span class="loading-spinner"></span>
            <p>Loading historical data...</p>
          </div>
          <div v-else class="chart-container">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>
      </div>

      <div class="right-column">
        <div class="market-status-card">
          <div class="market-header">
            <span class="status-dot"></span>
            <h4>Market Status</h4>
          </div>
          <p class="market-description">
            Markets are currently volatile due to upcoming economic reports. Historical patterns 
            suggest potential rate fluctuations for {{ currentCurrencyPair }} transfers in the next 48 hours.
          </p>
          <div class="market-stats">
            <div class="stat-item">
              <span class="stat-label">Volatility</span>
              <span class="stat-value">Medium</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Trend</span>
              <span class="stat-value" :class="{ positive: isPositiveChange, negative: !isPositiveChange }">
                {{ isPositiveChange ? 'Rising' : 'Falling' }}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">30D High</span>
              <span class="stat-value">{{ Math.max(...dataPoints).toFixed(4) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">30D Low</span>
              <span class="stat-value">{{ Math.min(...dataPoints).toFixed(4) }}</span>
            </div>
          </div>
        </div>

        <div class="trust-stats">
          <div class="trust-box">
            <span class="trust-value">4.9/5</span>
            <span class="trust-label">TRUSTPILOT SCORE</span>
          </div>
          <div class="trust-box">
            <span class="trust-value">Secure</span>
            <span class="trust-label">BANK-LEVEL ENCRYPTION</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rates-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px 20px;
}

.header-section {
  margin-bottom: 48px;
  max-width: 700px;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.main-description {
  color: var(--text-secondary);
  font-size: 1.125rem;
  line-height: 1.6;
}

.rates-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 32px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.currency-selector-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
}

.section-title {
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.currency-selector {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 24px;
}

.selector-group {
  flex: 1;
}

.selector-group label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 8px;
}

.currency-select {
  width: 100%;
  background: var(--bg-tertiary);
  border: 1px solid var(--input-border);
  border-radius: 12px;
  padding: 14px 16px;
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300E676' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}

.currency-select:hover {
  border-color: var(--accent-color);
}

.swap-button-container {
  padding-bottom: 14px;
}

.swap-button {
  background: var(--accent-color);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #000000;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.swap-button:hover {
  transform: scale(1.1) rotate(180deg);
}

.refresh-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: transparent;
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
  border-radius: 10px;
  padding: 14px 20px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-button:hover:not(:disabled) {
  background: var(--accent-color);
  color: #000000;
}

.refresh-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chart-section {
  background: rgba(10, 31, 26, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(26, 46, 41, 0.8);
  border-radius: 16px;
  padding: 24px;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 280px;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.chart-container {
  background: rgba(2, 11, 8, 0.5);
  border-radius: 12px;
  padding: 16px;
  height: 280px;
}

.market-status-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
}

.market-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--accent-color);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent-color);
}

.market-header h4 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary);
}

.market-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

.market-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item {
  background: var(--bg-tertiary);
  border-radius: 8px;
  padding: 12px;
}

.stat-label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.75rem;
  margin-bottom: 4px;
}

.stat-value {
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 600;
}

.stat-value.positive {
  color: #00E676;
}

.stat-value.negative {
  color: #ff6b7a;
}

.trust-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.trust-box {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
}

.trust-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.trust-label {
  color: var(--text-secondary);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

@media (max-width: 1024px) {
  .rates-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .rates-page {
    padding: 40px 16px 20px;
  }

  .main-title {
    font-size: 2rem;
  }

  .currency-selector {
    flex-direction: column;
    align-items: stretch;
  }

  .swap-button-container {
    display: flex;
    justify-content: center;
    padding: 8px 0;
  }

  .swap-button {
    transform: rotate(90deg);
  }

  .swap-button:hover {
    transform: scale(1.1) rotate(270deg);
  }
}
</style>

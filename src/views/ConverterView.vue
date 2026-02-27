<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
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
import CurrencyConverter from '../components/CurrencyConverter.vue'
import { useExchangeChartAI } from '../composables/useExchangeChartAI'

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

const labels = ref([])
const dataPoints = ref([])
const currentCurrencyPair = ref('USD/EUR')

const { aiResponse, isLoading: aiLoading, error: aiError, analyzeExchangeRate } = useExchangeChartAI()

const generateHistoricalData = () => {
  const newLabels = []
  const newData = []
  const baseRate = currentCurrencyPair.value === 'USD/EUR' ? 0.92 : 
                   currentCurrencyPair.value === 'USD/GBP' ? 0.79 : 1.35
  
  const now = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    newLabels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    
    const randomChange = (Math.random() - 0.5) * 0.02
    const trendFactor = (30 - i) * 0.0003
    newData.push((baseRate + randomChange + trendFactor).toFixed(4))
  }
  
  labels.value = newLabels
  dataPoints.value = newData.map(Number)
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

const updateChartData = () => {
  if (!chartInstance) return
  
  const lastValue = dataPoints.value[dataPoints.value.length - 1]
  const newValue = lastValue + (Math.random() - 0.5) * 0.005
  
  dataPoints.value.shift()
  dataPoints.value.push(Number(newValue.toFixed(4)))
  
  const now = new Date()
  const newLabel = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  labels.value.shift()
  labels.value.push(newLabel)
  
  chartInstance.data.labels = labels.value
  chartInstance.data.datasets[0].data = dataPoints.value
  chartInstance.update('active')
}

let updateInterval = null

const startRealTimeUpdates = () => {
  updateInterval = setInterval(() => {
    updateChartData()
  }, 5000)
}

const runAIAnalysis = () => {
  analyzeExchangeRate(labels.value, dataPoints.value, currentCurrencyPair.value)
}

onMounted(() => {
  generateHistoricalData()
  setTimeout(() => {
    initChart()
    startRealTimeUpdates()
    runAIAnalysis()
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

const currentRate = computed(() => {
  if (dataPoints.value.length === 0) return '0.0000'
  return dataPoints.value[dataPoints.value.length - 1].toFixed(4)
})

const rateChange = computed(() => {
  if (dataPoints.value.length < 2) return 0
  const current = dataPoints.value[dataPoints.value.length - 1]
  const previous = dataPoints.value[dataPoints.value.length - 2]
  return ((current - previous) / previous * 100).toFixed(2)
})

const isPositiveChange = computed(() => {
  return parseFloat(rateChange.value) >= 0
})
</script>

<template>
  <div class="converter-page">
    <div class="header-section">
      <h1 class="main-title">Smart Transfer Pro</h1>
      <p class="main-description">
        Analyze real-time exchange rates and optimize your international transfers with AI-driven insights. 
        Compare market highs and find the perfect moment to send.
      </p>
    </div>

    <div class="converter-grid">
      <div class="left-column">
        <CurrencyConverter />
        
        <div class="chart-section">
          <div class="chart-header">
            <div class="rate-info">
              <span class="current-rate-label">Current Rate</span>
              <span class="current-rate-value">{{ currentRate }} {{ currentCurrencyPair.split('/')[1] }}</span>
              <span class="rate-change" :class="{ positive: isPositiveChange, negative: !isPositiveChange }">
                {{ isPositiveChange ? '↑' : '↓' }} {{ rateChange }}%
              </span>
            </div>
            <button class="analyze-btn" @click="runAIAnalysis" :disabled="aiLoading">
              {{ aiLoading ? 'Analyzing...' : 'Analyze Market' }}
            </button>
          </div>
          
          <div class="chart-container">
            <canvas ref="chartCanvas"></canvas>
          </div>
          
          <div class="ai-insight-section">
            <div class="ai-question">
              <span class="question-icon">🤔</span>
              <h3>Is this a good time to send money?</h3>
            </div>
            
            <div class="ai-response" v-if="aiResponse">
              <div class="response-loading" v-if="aiLoading">
                <span class="loading-spinner"></span>
                <p>Analyzing market data...</p>
              </div>
              <div class="response-content" v-else>
                <p>{{ aiResponse }}</p>
              </div>
            </div>
            
            <div class="ai-error" v-else-if="aiError">
              <p>{{ aiError }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="right-column">
        <div class="analyst-note">
           <div class="note-icon"></div>
           <div class="note-content">
             <h4>Analyst Note</h4>
             <p>The USD is currently trading 0.8% above its weekly mean. European Central Bank announcements tomorrow may introduce volatility. Sending now captures current strength.</p>
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
        
        <div class="market-info-card">
           <div class="info-header">
             <span class="status-dot"></span>
             <h4>Market Status</h4>
           </div>
           <p>Markets are currently volatile due to upcoming economic reports. Historical patterns suggest potential gains for USD/EUR transfers in the next 48 hours.</p>
        </div>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-item">
        <h4>Instant Settlement</h4>
        <p>Most transfers are completed within seconds using our global liquidity network.</p>
      </div>
      <div class="feature-item">
        <h4>Deep Analytics</h4>
        <p>Access historical data spanning 10+ years to make informed financial decisions.</p>
      </div>
      <div class="feature-item">
        <h4>Regulated & Safe</h4>
        <p>Fully licensed in over 45 countries with rigorous compliance protocols.</p>
      </div>
    </div>

    <footer class="site-footer">
      <div class="footer-left">
        <div class="footer-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          </svg>
          <span>MoneyLink</span>
        </div>
      </div>
      
      <div class="footer-center">
        <p class="copyright">© 2024 moneyLink Hi-tech solutions. All rights reserved.</p>
      </div>
      
      <div class="footer-right">
        <div class="footer-icons">
          <a href="#" class="footer-icon-link" title="Language">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10a15.3 15.3 0 0 1-4 10a15.3 15.3 0 0 1-4-10a15.3 15.3 0 0 1 4-10z"/></svg>
          </a>
          <a href="#" class="footer-icon-link" title="Contact">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </a>
          <a href="#" class="footer-icon-link" title="Help">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.converter-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px 20px;
}

.header-section {
  margin-bottom: 48px;
  max-width: 600px;
}

.main-title {
  font-size: 3rem;
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

.converter-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 32px;
  margin-bottom: 80px;
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

.chart-section {
  background: rgba(10, 31, 26, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(26, 46, 41, 0.8);
  border-radius: 16px;
  padding: 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.rate-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.current-rate-label {
  color: #A0A0A0;
  font-size: 0.875rem;
}

.current-rate-value {
  color: #FFFFFF;
  font-size: 1.5rem;
  font-weight: 700;
}

.rate-change {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.rate-change.positive {
  color: #00E676;
  background: rgba(0, 230, 118, 0.1);
}

.rate-change.negative {
  color: #ff6b7a;
  background: rgba(255, 107, 122, 0.1);
}

.analyze-btn {
  background: transparent;
  border: 1px solid #00E676;
  color: #00E676;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.analyze-btn:hover:not(:disabled) {
  background: #00E676;
  color: #000000;
}

.analyze-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chart-container {
  background: rgba(2, 11, 8, 0.5);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  height: 280px;
}

.ai-insight-section {
  background: rgba(2, 11, 8, 0.5);
  border: 1px solid #1a2e29;
  border-radius: 12px;
  padding: 20px;
}

.ai-question {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.question-icon {
  font-size: 1.5rem;
}

.ai-question h3 {
  color: #FFFFFF;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.ai-response {
  min-height: 60px;
}

.response-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #A0A0A0;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #1a2e29;
  border-top-color: #00E676;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.response-content {
  background: rgba(0, 230, 118, 0.05);
  border: 1px solid rgba(0, 230, 118, 0.2);
  border-radius: 8px;
  padding: 16px;
}

.response-content p {
  color: #FFFFFF;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 0;
}

.ai-error {
  color: #ff6b7a;
  font-size: 0.875rem;
}

.analyst-note {
  background: var(--bg-secondary);
  border: 1px solid var(--accent-color);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  gap: 16px;
}

.note-content h4 {
  margin: 0 0 8px 0;
  font-size: 1rem;
}

.note-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
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
}

.trust-label {
  color: var(--text-secondary);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.market-info-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
}

.info-header {
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

.info-header h4 {
  margin: 0;
  font-size: 1rem;
}

.market-info-card p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  border-top: 1px solid var(--border-color);
  padding: 80px 0;
  margin-top: 40px;
}

.feature-item h4 {
  font-size: 1.25rem;
  margin-bottom: 12px;
}

.feature-item p {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.5;
}

.site-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 0;
  border-top: 1px solid var(--border-color);
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #FFFFFF;
  font-weight: 700;
  font-size: 1.125rem;
}

.footer-logo svg {
  color: #00E676;
}

.copyright {
  color: var(--text-secondary);
  font-size: 0.8125rem;
}

.footer-icons {
  display: flex;
  gap: 20px;
}

.footer-icon-link {
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

.footer-icon-link:hover {
  color: var(--accent-color);
}

@media (max-width: 1024px) {
  .converter-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2.25rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 40px 0;
  }

  .site-footer {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
  
  .chart-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .rate-info {
    flex-wrap: wrap;
  }
}
</style>

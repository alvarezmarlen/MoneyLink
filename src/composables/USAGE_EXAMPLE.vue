<!-- 
  EXAMPLE: How to use useExchangeChart composable in a Vue 3 component
  Location: src/views/ExchangeChartView.vue (example)
-->

<template>
  <div class="exchange-chart-container">
    <div v-if="chartData.hasError" class="error-alert">
      {{ chartData.errorMessage }}
    </div>

    <div v-if="chartData.isLoading" class="loading-spinner">
      Loading chart data...
    </div>

    <!-- Canvas for the chart -->
    <canvas ref="chartCanvas" class="exchange-chart"></canvas>

    <!-- Controls (optional) -->
    <div class="chart-controls">
      <button @click="loadExampleData">Load Example Data</button>
      <button @click="handleChartUpdate">Update Chart</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useExchangeChart } from '@/composables/useExchangeChart'

// Use the composable
const {
  chartCanvas,
  chartConfig,
  chartData,
  initChart,
  updateChart,
  updateChartConfig,
  destroyChart
} = useExchangeChart()

// Example data for demo purposes
const exampleLabels = ref([
  'Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5',
  'Jan 6', 'Jan 7', 'Jan 8', 'Jan 9', 'Jan 10'
])

const exampleDataPoints = ref([
  0.9250, 0.9265, 0.9240, 0.9280, 0.9310,
  0.9295, 0.9320, 0.9305, 0.9340, 0.9355
])

// Initialize chart when component mounts
onMounted(() => {
  initChart(
    exampleLabels.value,
    exampleDataPoints.value,
    'USD/EUR Exchange Rate Week (Jan 1-10)',
    'USD/EUR'
  )
})

// Function to load example data
const loadExampleData = () => {
  const newLabels = [
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
  ]
  
  const newData = [
    0.9200, 0.9215, 0.9188, 0.9245, 0.9270, 0.9250, 0.9280
  ]
  
  updateChart(newLabels, newData)
}

// Function to update chart configuration
const handleChartUpdate = () => {
  updateChartConfig('Updated Exchange Rate Data', 'EUR/USD')
}

// Cleanup on unmount
onMounted(() => {
  return () => {
    destroyChart()
  }
})
</script>

<style scoped>
.exchange-chart-container {
  width: 100%;
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.exchange-chart {
  width: 100%;
  max-height: 400px;
  margin-bottom: 20px;
}

.chart-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.chart-controls button {
  padding: 10px 20px;
  background-color: var(--accent-color);
  color: #000;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-controls button:hover {
  background-color: var(--accent-hover);
  transform: translateY(-2px);
}

.error-alert {
  padding: 15px;
  background-color: rgba(255, 68, 68, 0.1);
  color: #ff4444;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 68, 68, 0.3);
}

.loading-spinner {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
  font-size: 1rem;
}
</style>

<!-- 
  USAGE GUIDE:
  
  1. Import the composable:
     import { useExchangeChart } from '@/composables/useExchangeChart'
  
  2. Destructure the returned values:
     const { chartCanvas, chartConfig, chartData, initChart, updateChart } = useExchangeChart()
  
  3. Bind the ref to a canvas element:
     <canvas ref="chartCanvas"></canvas>
  
  4. Initialize the chart with data in onMounted or when data is available:
     onMounted(() => {
       initChart(labels, dataPoints, 'Chart Title', 'USD/EUR')
     })
  
  5. Update the chart reactively:
     updateChart(newLabels, newDataPoints)
  
  6. Access reactive state:
     - chartConfig.labels: Current labels array
     - chartConfig.dataPoints: Current data points
     - chartConfig.chartTitle: Current chart title
     - chartConfig.currency: Current currency pair
     - chartData.isLoading: Loading state
     - chartData.hasError: Error state
     - chartData.errorMessage: Error message
  
  7. Update configuration without replacing the chart:
     updateChartConfig('New Title', 'EUR/USD')
  
  8. Cleanup on component unmount:
     destroyChart()
-->

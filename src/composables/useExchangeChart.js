import { ref, reactive, watch, onMounted } from 'vue'
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

// Register required Chart.js modules
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
)

/**
 * Composable for managing an exchange rate chart using Chart.js
 * Provides reactive state and functions to initialize and update the chart
 *
 * @returns {Object} Chart composable with methods and state
 */
export function useExchangeChart() {
  // Reference to the canvas DOM element
  const chartCanvas = ref(null)

  // Chart instance reference
  let chartInstance = null

  // Reactive state for chart configuration
  const chartConfig = reactive({
    labels: [],
    dataPoints: [],
    chartTitle: 'Exchange Rate Evolution',
    currency: 'USD/EUR'
  })

  // Reactive state for chart data
  const chartData = reactive({
    isLoading: false,
    hasError: false,
    errorMessage: ''
  })

  /**
   * Initialize the chart with provided data
   * Creates a new Chart instance and configures it with the current state
   *
   * @param {Array} labels - Array of date/time labels for the X-axis
   * @param {Array} dataPoints - Array of exchange rate values for the Y-axis
   * @param {String} chartTitle - Title for the chart
   * @param {String} currency - Currency pair (e.g., 'USD/EUR')
   */
  const initChart = (labels = [], dataPoints = [], chartTitle = 'Exchange Rate Evolution', currency = 'USD/EUR') => {
    try {
      // Validate inputs
      if (!chartCanvas.value) {
        throw new Error('Canvas element not found. Ensure the ref is properly bound.')
      }

      if (labels.length === 0 || dataPoints.length === 0) {
        console.warn('Warning: Empty labels or dataPoints provided')
      }

      // Update configuration
      chartConfig.labels = labels
      chartConfig.dataPoints = dataPoints
      chartConfig.chartTitle = chartTitle
      chartConfig.currency = currency

      // Destroy existing chart instance if it exists
      if (chartInstance) {
        chartInstance.destroy()
      }

      // Create new chart instance
      const ctx = chartCanvas.value.getContext('2d')

      chartInstance = new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: chartConfig.labels,
          datasets: [
            {
              label: chartConfig.currency,
              data: chartConfig.dataPoints,
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.05)',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: '#4CAF50',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointHoverRadius: 6,
              tension: 0.3, // Smooth curved line
              fill: true,
              spanGaps: true, // Connect gaps in data
              tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                  size: 13,
                  weight: 'bold'
                },
                bodyFont: {
                  size: 12
                },
                cornerRadius: 4
              }
            }
          ]
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
              text: chartConfig.chartTitle,
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
                  let label = context.dataset.label || ''
                  if (label) {
                    label += ': '
                  }
                  if (context.parsed.y !== null) {
                    label += context.parsed.y.toFixed(4)
                  }
                  return label
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
              }
            }
          }
        }
      })

      chartData.isLoading = false
      chartData.hasError = false
    } catch (error) {
      console.error('Error initializing chart:', error)
      chartData.hasError = true
      chartData.errorMessage = error.message
    }
  }

  /**
   * Update the chart with new data
   * Updates an existing chart instance without recreating it
   *
   * @param {Array} newLabels - Updated array of date/time labels
   * @param {Array} newDataPoints - Updated array of exchange rate values
   */
  const updateChart = (newLabels = [], newDataPoints = []) => {
    try {
      if (!chartInstance) {
        throw new Error('Chart instance not initialized. Call initChart() first.')
      }

      if (newLabels.length !== newDataPoints.length) {
        console.warn('Warning: Labels and dataPoints arrays have different lengths')
      }

      // Update chart data
      chartInstance.data.labels = newLabels
      chartInstance.data.datasets[0].data = newDataPoints

      // Refresh the chart
      chartInstance.update('active')

      chartData.isLoading = false
      chartData.hasError = false
    } catch (error) {
      console.error('Error updating chart:', error)
      chartData.hasError = true
      chartData.errorMessage = error.message
    }
  }

  /**
   * Update chart configuration (title, currency pair)
   *
   * @param {String} newTitle - New chart title
   * @param {String} newCurrency - New currency pair
   */
  const updateChartConfig = (newTitle = '', newCurrency = '') => {
    if (newTitle) {
      chartConfig.chartTitle = newTitle
      if (chartInstance) {
        chartInstance.options.plugins.title.text = newTitle
      }
    }

    if (newCurrency) {
      chartConfig.currency = newCurrency
      if (chartInstance && chartInstance.data.datasets[0]) {
        chartInstance.data.datasets[0].label = newCurrency
      }
    }

    if (chartInstance) {
      chartInstance.update()
    }
  }

  /**
   * Destroy the chart instance and cleanup resources
   */
  const destroyChart = () => {
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
  }

  /**
   * Watch for changes in labels or dataPoints to auto-update the chart
   * This enables reactive updates when data changes
   */
  watch(
    () => ({
      labels: chartConfig.labels,
      dataPoints: chartConfig.dataPoints
    }),
    (newVal) => {
      if (chartInstance && newVal.labels.length > 0 && newVal.dataPoints.length > 0) {
        updateChart(newVal.labels, newVal.dataPoints)
      }
    },
    { deep: true }
  )

  /**
   * Initialize chart when component mounts
   */
  onMounted(() => {
    if (chartCanvas.value) {
      // Chart is ready to be initialized when this hook is called
      // Initial data should be provided through initChart() in the consuming component
    }
  })

  /**
   * TODO: AI Agent Integration Point
   * 
   * Location for integrating an AI agent that can:
   * - Analyze the exchange rate chart and provide insights
   * - Generate natural language explanations of trends
   * - Predict future movements based on historical data
   * - Provide recommendations for optimal transfer timing
   * 
   * Expected integration method:
   * const { generateChartAnalysis, getPredictions } = useExchangeChartAI(chartConfig)
   * 
   * This would be called when the chart updates:
   * watch(() => chartConfig.dataPoints, async (newData) => {
   *   const analysis = await generateChartAnalysis(newData)
   *   // Display analysis to user
   * })
   */

  return {
    // Refs and reactive state
    chartCanvas,
    chartConfig,
    chartData,

    // Methods
    initChart,
    updateChart,
    updateChartConfig,
    destroyChart
  }
}

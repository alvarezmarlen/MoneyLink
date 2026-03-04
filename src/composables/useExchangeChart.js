import { ref } from 'vue'
import { Chart } from 'chart.js/auto'

export function useExchangeChart() {
  const chartCanvas = ref(null)
  const chartData = ref({
    labels: [],
    dataPoints: []
  })
  let chartInstance = null

  const initChart = (labels, dataPoints, title = 'Exchange Rate', currencyPair = 'USD/EUR') => {
    if (!chartCanvas.value) {
      console.warn('Chart canvas not ready')
      return
    }

    // Store data
    chartData.value = { labels, dataPoints }

    // Destroy existing chart
    if (chartInstance) {
      chartInstance.destroy()
    }

    const ctx = chartCanvas.value.getContext('2d')

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: currencyPair,
          data: dataPoints,
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
            text: title,
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

  const updateChart = (labels, dataPoints) => {
    if (!chartInstance) return

    chartData.value = { labels, dataPoints }
    chartInstance.data.labels = labels
    chartInstance.data.datasets[0].data = dataPoints
    chartInstance.update('active')
  }

  const destroyChart = () => {
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
  }

  return {
    chartCanvas,
    chartData,
    initChart,
    updateChart,
    destroyChart
  }
}

# useExchangeChart Composable Documentation

## Overview

`useExchangeChart` is a Vue 3 composable that manages exchange rate charts using Chart.js. It provides a clean, reactive interface for displaying and updating line charts with exchange rate data.

## Features

✅ **Reactive State Management** - Uses Vue 3 Composition API (ref, reactive, watch, onMounted)
✅ **Chart.js Integration** - Fully registered modules for line charts
✅ **Auto-update** - Watches for data changes and updates the chart automatically
✅ **Error Handling** - Comprehensive error states and messages
✅ **Easy Configuration** - Simple methods to update chart data and titles
✅ **Clean Styling** - Green accent color, transparent background, smooth curves
✅ **Tooltip Support** - Interactive tooltips for data points
✅ **Responsive** - Adapts to container size
✅ **AI-Ready** - Integration points prepared for AI agent analysis

## Installation

The composable is already added to your project at:
```
src/composables/useExchangeChart.js
```

## Basic Usage

### 1. Import the Composable

```javascript
import { useExchangeChart } from '@/composables/useExchangeChart'
```

### 2. Use in Your Component

```vue
<script setup>
import { onMounted } from 'vue'
import { useExchangeChart } from '@/composables/useExchangeChart'

// Destructure the composable
const {
  chartCanvas,
  chartConfig,
  chartData,
  initChart,
  updateChart,
  updateChartConfig,
  destroyChart
} = useExchangeChart()

// Initialize chart when component mounts
onMounted(() => {
  const labels = ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5']
  const dataPoints = [0.925, 0.930, 0.928, 0.935, 0.940]
  
  initChart(labels, dataPoints, 'USD/EUR Exchange Rate', 'USD/EUR')
})
</script>

<template>
  <canvas ref="chartCanvas"></canvas>
</template>
```

## API Reference

### State

#### `chartCanvas` (ref)
- **Type:** HTMLCanvasElement reference
- **Description:** Reference to the canvas DOM element
- **Example:** `<canvas ref="chartCanvas"></canvas>`

#### `chartConfig` (reactive)
- **Type:** Object
- **Properties:**
  - `labels []` - Array of date/time labels for X-axis
  - `dataPoints []` - Array of exchange rate values for Y-axis
  - `chartTitle: string` - Title displayed on the chart
  - `currency: string` - Currency pair (e.g., 'USD/EUR')

#### `chartData` (reactive)
- **Type:** Object
- **Properties:**
  - `isLoading: boolean` - Loading state flag
  - `hasError: boolean` - Error state flag
  - `errorMessage: string` - Detailed error message

### Methods

#### `initChart(labels, dataPoints, chartTitle, currency)`
Initializes a new chart instance.

**Parameters:**
- `labels` (Array) - Date/time labels for the X-axis
- `dataPoints` (Array) - Exchange rate values for the Y-axis
- `chartTitle` (String) - Title for the chart
- `currency` (String) - Currency pair (default: 'USD/EUR')

**Example:**
```javascript
initChart(
  ['2024-01-01', '2024-01-02', '2024-01-03'],
  [0.925, 0.930, 0.928],
  'USD/EUR Weekly Trend',
  'USD/EUR'
)
```

#### `updateChart(newLabels, newDataPoints)`
Updates an existing chart with new data without recreating it.

**Parameters:**
- `newLabels` (Array) - New labels array
- `newDataPoints` (Array) - New data points array

**Example:**
```javascript
updateChart(
  ['Mon', 'Tue', 'Wed'],
  [0.920, 0.925, 0.930]
)
```

#### `updateChartConfig(newTitle, newCurrency)`
Updates chart configuration (title and currency pair).

**Parameters:**
- `newTitle` (String) - New chart title
- `newCurrency` (String) - New currency pair

**Example:**
```javascript
updateChartConfig('Updated Exchange Rate', 'EUR/USD')
```

#### `destroyChart()`
Cleans up and destroys the chart instance.

**Example:**
```javascript
destroyChart()
```

## Integration with ExchangeRateAPI

### Example: Fetching Real Exchange Rate Data

```javascript
import { ref, onMounted } from 'vue'
import { useExchangeChart } from '@/composables/useExchangeChart'

const { initChart, updateChart, chartData } = useExchangeChart()

onMounted(async () => {
  try {
    chartData.isLoading = true
    
    // Fetch historical exchange rate data
    const response = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD'
    )
    const data = await response.json()
    
    // Process data for chart
    const labels = generateDateLabels(30) // Last 30 days
    const dataPoints = await fetchHistoricalRates('USD', 'EUR', labels)
    
    // Initialize chart with real data
    initChart(
      labels,
      dataPoints,
      'USD to EUR - 30 Day Trend',
      'USD/EUR'
    )
  } catch (error) {
    console.error('Error fetching exchange rates:', error)
    chartData.hasError = true
    chartData.errorMessage = 'Failed to load exchange rate data'
  }
})

function generateDateLabels(days) {
  const labels = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
  }
  return labels
}
```

## Chart Configuration

### Visual Styling
- **Line Color:** #4CAF50 (Green)
- **Background:** Transparent with light green fill (rgba(76, 175, 80, 0.05))
- **Line Tension:** 0.3 (Smooth curved line)
- **Point Radius:** 4px
- **Point Hover Radius:** 6px

### Features Enabled
- ✅ Responsive
- ✅ Tooltip on hover
- ✅ Legend visible
- ✅ Smooth curves (tension 0.3)
- ✅ Interactive data points
- ✅ Grid display

### Scales
- **Y-Axis:** Linear scale with 4 decimal precision
- **X-Axis:** Category scale for date labels

## Reactive Updates

The composable automatically watches for changes in `chartConfig.labels` or `chartConfig.dataPoints` and updates the chart:

```javascript
// When you update the config, the chart updates automatically
watch(() => ({
  labels: chartConfig.labels,
  dataPoints: chartConfig.dataPoints
}), (newVal) => {
  updateChart(newVal.labels, newVal.dataPoints)
})
```

## Error Handling

The composable includes comprehensive error handling:

```javascript
if (chartData.hasError) {
  // Display error message to user
  console.error(chartData.errorMessage)
}

if (chartData.isLoading) {
  // Show loading spinner
}
```

## Best Practices

1. **Always bind the canvas ref:**
   ```vue
   <canvas ref="chartCanvas"></canvas>
   ```

2. **Initialize in onMounted:**
   ```javascript
   onMounted(() => {
     initChart(labels, dataPoints, title, currency)
   })
   ```

3. **Cleanup on unmount:**
   ```javascript
   onBeforeUnmount(() => {
     destroyChart()
   })
   ```

4. **Validate data before initialization:**
   ```javascript
   if (labels.length > 0 && dataPoints.length > 0) {
     initChart(labels, dataPoints, title, currency)
   }
   ```

5. **Handle errors gracefully:**
   ```javascript
   try {
     initChart(...)
   } catch (error) {
     chartData.hasError = true
     chartData.errorMessage = error.message
   }
   ```

## AI Agent Integration

The composable is prepared for AI agent integration. There's a marked integration point in the code:

### Location
In `src/composables/useExchangeChart.js`, search for:
```javascript
/**
 * TODO: AI Agent Integration Point
 * ...
 */
```

### Planned AI Capabilities

The AI agent could be integrated to:

1. **Analyze Trends** - Understand exchange rate patterns
2. **Generate Explanations** - Provide natural language insights
3. **Make Predictions** - Forecast future exchange rates
4. **Recommend Actions** - Suggest optimal transfer times
5. **Risk Assessment** - Identify volatility patterns

### Integration Pattern

```javascript
import { useExchangeChartAI } from '@/composables/useExchangeChartAI'

const { generateChartAnalysis, getPredictions } = useExchangeChartAI()

// When chart updates
watch(() => chartConfig.dataPoints, async (newData) => {
  const analysis = await generateChartAnalysis(newData)
  const predictions = await getPredictions(newData)
  
  // Display analysis and predictions to user
  console.log('Analysis:', analysis)
  console.log('Predictions:', predictions)
})
```

## Troubleshooting

### Canvas not found error
**Problem:** "Canvas element not found"
**Solution:** Ensure the `ref="chartCanvas"` is properly bound to a `<canvas>` element

### Chart not updating
**Problem:** Chart doesn't update when data changes
**Solution:** Ensure you're using `updateChart()` or the reactive properties properly

### Multiple charts on same page
**Problem:** Charts interfere with each other
**Solution:** Use a separate instance of `useExchangeChart()` for each chart

### Performance issues
**Problem:** Chart updates are slow
**Solution:** Limit the number of data points (e.g., max 365 for daily data)

## File Structure

```
src/
  composables/
    useExchangeChart.js          <- Main composable
    USAGE_EXAMPLE.vue            <- Example component
    README.md                    <- This file
```

## Dependencies

- Vue 3 (Composition API)
- Chart.js 4.x
- Vite (build tool)

## License

Part of the MoneyLink project

## Support

For issues or questions, check the example files or create an issue in the project repository.

<script setup>
import CurrencyConverter from '../components/CurrencyConverter.vue'
</script>

<template>
  <div class="converter-view">
    <CurrencyConverter />
  </div>
</template>

<style scoped>
.converter-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 24px 16px;
}
</style>

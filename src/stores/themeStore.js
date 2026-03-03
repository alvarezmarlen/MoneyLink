import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark' || false)

  const theme = computed(() => (isDark.value ? 'dark' : 'light'))

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  const setTheme = (newTheme) => {
    isDark.value = newTheme === 'dark'
  }

  // Persistir el tema en localStorage cuando cambia
  watch(isDark, (newValue) => {
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
    // Aplicar el tema al documento
    document.documentElement.setAttribute('data-theme', newValue ? 'dark' : 'light')
  }, { immediate: true })

  return { isDark, theme, toggleTheme, setTheme }
})

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { authService } from './services/authService'
import { useThemeStore } from './stores/themeStore'

const isAuthenticated = ref(false)
const currentUser = ref(null)
const themeStore = useThemeStore()

const checkAuth = () => {
  isAuthenticated.value = authService.isAuthenticated()
  if (isAuthenticated.value) {
    currentUser.value = authService.getCurrentUser()
  }
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

onMounted(() => {
  checkAuth()
})
</script>

<template>
  <div class="app-container" :data-theme="themeStore.theme">
    <nav class="navbar">
      <div class="navbar-brand">
        <RouterLink to="/" class="logo">
          <span class="logo-icon">💸</span>
          <span class="logo-text">MoneyLink</span>
        </RouterLink>
      </div>
      
      <div class="navbar-links">
        <RouterLink to="/converter" class="nav-link">Pro</RouterLink>
        <a href="#" class="nav-link">Markets</a>
        <RouterLink to="/rates" class="nav-link">Rates</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/dashboard" class="nav-link">Dashboard</RouterLink>
      </div>
      
      <div class="navbar-auth">
        <button class="theme-toggle" @click="toggleTheme" :title="`Switch to ${themeStore.isDark ? 'light' : 'dark'} mode`">
          <span v-if="themeStore.isDark">☀️</span>
          <span v-else>🌙</span>
        </button>
        <template v-if="isAuthenticated">
          <span class="user-name">{{ currentUser?.fullName?.split(' ')[0] }}</span>
          <RouterLink to="/dashboard" class="dashboard-link">Mi Cuenta</RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/login" class="auth-link">Log In</RouterLink>
          <RouterLink to="/register" class="auth-button">Sign Up</RouterLink>
        </template>
      </div>
    </nav>

    <main class="main-content">
      <RouterView @auth-change="checkAuth" />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Dark mode colors (default) */
  --bg-primary: #020b08;
  --bg-secondary: #0a1f1a;
  --bg-tertiary: #112a24;
  --text-primary: #FFFFFF;
  --text-secondary: #A0A0A0;
  --border-color: #1a2e29;
  --accent-color: #00E676;
  --accent-hover: #00C853;
  --input-bg: #0f2420;
  --input-border: #1a3a35;
}

[data-theme="light"] {
  --bg-primary: #F5F5F5;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #F0F0F0;
  --text-primary: #000000;
  --text-secondary: #666666;
  --border-color: #E0E0E0;
  --accent-color: #00C853;
  --accent-hover: #00B348;
  --input-bg: #FFFFFF;
  --input-border: #D0D0D0;
}

body {
  font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.navbar-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9375rem;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--accent-color);
}

.navbar-auth {
  display: flex;
  align-items: center;
  gap: 24px;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  background-color: var(--bg-tertiary);
}

.auth-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9375rem;
  transition: color 0.2s ease;
}

.auth-link:hover {
  color: var(--text-primary);
}

.auth-button {
  background: var(--accent-color);
  color: #000000;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.auth-button:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.user-name {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.dashboard-link {
  color: var(--accent-color);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.dashboard-link:hover {
  color: var(--accent-hover);
}

.main-content {
  flex: 1;
}

@media (max-width: 768px) {
  .navbar {
    padding: 12px 16px;
  }
  
  .navbar-links {
    display: none;
  }
  
  .logo-text {
    font-size: 1.25rem;
  }
}
</style>

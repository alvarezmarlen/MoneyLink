<script setup>
import CurrencyConverter from '../components/CurrencyConverter.vue'
</script>

<template>
  <div class="converter-page">
    <div class="header-section">
      <h1 class="main-title">Smart Transfer Pro</h1>
      <p class="main-description">
        Send money internationally with the best exchange rates. 
        Compare markets and find the perfect moment to transfer.
      </p>
    </div>

    <div class="converter-grid">
      <div class="left-column">
        <CurrencyConverter />
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
}
</style>

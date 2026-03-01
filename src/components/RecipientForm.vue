<script setup>
import { ref, onMounted } from 'vue'
import { recipientService } from '../services/recipientService'
import { CURRENCIES } from '../constants/currencies'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  fullName: '',
  country: '',
  accountNumber: '',
  phone: '',
  email: '',
  isFrequent: false
})

const errors = ref({})
const savedRecipients = ref([])

onMounted(async () => {
  savedRecipients.value = await recipientService.getRecipients()
  
  if (props.initialData) {
    form.value = { ...props.initialData }
  }
})

// Derive countries from CURRENCIES constant
const countries = CURRENCIES.map(c => ({
  code: c.code, // Using currency code as the identifier
  name: c.region,
  flag: c.flag,
  currency: c.code
})).sort((a, b) => a.name.localeCompare(b.name))

const validate = () => {
  errors.value = {}
  
  if (!form.value.fullName || form.value.fullName.length < 2) {
    errors.value.fullName = 'Name must be at least 2 characters long'
  }
  
  if (!form.value.country) {
    errors.value.country = 'Select a country'
  }
  
  if (!form.value.accountNumber) {
    errors.value.accountNumber = 'Account number is required'
  }
  
  if (!form.value.phone) {
    errors.value.phone = 'Phone number is required'
  } else if (!/^\+?[\d\s-]{8,}$/.test(form.value.phone)) {
    errors.value.phone = 'Invalid phone format'
  }
  
  if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Invalid email format'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return
  
  try {
    if (form.value.isFrequent) {
      await recipientService.saveRecipient({
        fullName: form.value.fullName,
        country: form.value.country,
        accountNumber: form.value.accountNumber,
        phone: form.value.phone,
        email: form.value.email,
        isFrequent: true
      })
    }
    
    emit('submit', { ...form.value })
  } catch (error) {
    console.error('Error in form submission:', error)
    // Here you could add an error message property if needed
  }
}

const selectRecipient = (recipient) => {
  form.value.fullName = recipient.fullName
  form.value.country = recipient.country
  form.value.accountNumber = recipient.accountNumber
  form.value.phone = recipient.phone
  form.value.email = recipient.email
  form.value.isFrequent = recipient.isFrequent || false
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="recipient-form">
    <div v-if="savedRecipients.length > 0" class="frequent-section">
      <label class="section-label">Saved Recipients</label>
      <div class="frequent-list">
        <button 
          v-for="recipient in savedRecipients" 
          :key="recipient.id"
          type="button"
          class="frequent-chip"
          @click="selectRecipient(recipient)"
        >
          {{ recipient.fullName }}
        </button>
      </div>
    </div>

    <div class="form-group">
      <label for="recipient-name">Full Name</label>
      <input
        id="recipient-name"
        v-model="form.fullName"
        type="text"
        placeholder="Enter recipient full name"
        :class="{ 'input-error': errors.fullName }"
      />
      <span v-if="errors.fullName" class="error-text">{{ errors.fullName }}</span>
    </div>

    <div class="form-group">
      <label for="recipient-country">Destination Country</label>
      <select
        id="recipient-country"
        v-model="form.country"
        :class="{ 'input-error': errors.country }"
      >
        <option value="">Select a country</option>
        <option v-for="country in countries" :key="country.code" :value="country.code">
          {{ country.flag }} {{ country.name }} ({{ country.currency }})
        </option>
      </select>
      <span v-if="errors.country" class="error-text">{{ errors.country }}</span>
    </div>

    <div class="form-group">
      <label for="recipient-account">Account Number / IBAN</label>
      <input
        id="recipient-account"
        v-model="form.accountNumber"
        type="text"
        placeholder="Enter account number"
        :class="{ 'input-error': errors.accountNumber }"
      />
      <span v-if="errors.accountNumber" class="error-text">{{ errors.accountNumber }}</span>
    </div>

    <div class="form-group">
      <label for="recipient-phone">Phone Number</label>
      <input
        id="recipient-phone"
        v-model="form.phone"
        type="tel"
        placeholder="+57 300 123 4567"
        :class="{ 'input-error': errors.phone }"
      />
      <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
    </div>

    <div class="form-group">
      <label for="recipient-email">Email (Optional)</label>
      <input
        id="recipient-email"
        v-model="form.email"
        type="email"
        placeholder="email@example.com"
        :class="{ 'input-error': errors.email }"
      />
      <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
    </div>

    <div class="form-group checkbox-group">
      <label class="checkbox-label">
        <input
          type="checkbox"
          v-model="form.isFrequent"
        />
        <span class="checkmark"></span>
        <span class="checkbox-text">Save as frequent recipient</span>
      </label>
    </div>

    <div class="form-actions">
      <button type="button" class="cancel-button" @click="emit('cancel')">
        Cancel
      </button>
      <button type="submit" class="submit-button">
        Continue
      </button>
    </div>
  </form>
</template>

<style scoped>
.recipient-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.frequent-section {
  margin-bottom: 8px;
}

.section-label {
  display: block;
  color: #A0A0A0;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 10px;
}

.frequent-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.frequent-chip {
  background: rgba(0, 230, 118, 0.1);
  border: 1px solid rgba(0, 230, 118, 0.3);
  color: #00E676;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.frequent-chip:hover {
  background: rgba(0, 230, 118, 0.2);
  transform: scale(1.02);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  color: #A0A0A0;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-group input,
.form-group select {
  background: #020b08;
  border: 1px solid #1a2e29;
  border-radius: 8px;
  padding: 12px 16px;
  color: #FFFFFF;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input::placeholder {
  color: #5a6a65;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #00E676;
  box-shadow: 0 0 0 2px rgba(0, 230, 118, 0.2);
}

.form-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23A0A0A0' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}

.form-group input.input-error,
.form-group select.input-error {
  border-color: #ff6b7a;
}

.error-text {
  color: #ff6b7a;
  font-size: 0.75rem;
}

.checkbox-group {
  margin-top: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: #A0A0A0;
  font-size: 0.9375rem;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #1a2e29;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox-label input:checked + .checkmark {
  background: #00E676;
  border-color: #00E676;
}

.checkbox-label input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid #000000;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-text {
  color: #A0A0A0;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.cancel-button {
  flex: 1;
  background: transparent;
  border: 1px solid #1a2e29;
  color: #A0A0A0;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  border-color: #00E676;
  color: #00E676;
}

.submit-button {
  flex: 2;
  background: #00E676;
  color: #000000;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover {
  background: #00C853;
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .cancel-button {
    flex: 1;
  }
  
  .submit-button {
    flex: 1;
  }
}
</style>

# Sistema de Tema Claro/Oscuro - Implementación con Pinia

## Descripción

Se ha implementado un sistema de cambio de tema claro/oscuro en la aplicación MoneyLink usando **Pinia** como gestor de estado.

## Cambios Realizados

### 1. **Creación del Store de Pinia** (`src/stores/themeStore.js`)
- **Función:** Gestiona el estado del tema (claro u oscuro)
- **Características:**
  - Persiste la preferencia del usuario en `localStorage`
  - Proporciona acciones para cambiar el tema
  - Aplica automáticamente el atributo `data-theme` al elemento raíz HTML
  - Estado reactivo con Vue 3 Composition API

```javascript
export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark' || false)
  const theme = computed(() => (isDark.value ? 'dark' : 'light'))
  const toggleTheme = () => { isDark.value = !isDark.value }
  // ...
})
```

### 2. **Actualización de App.vue**
- Import del store de tema
- Botón de cambio de tema en la navbar (☀️/🌙)
- Atributo dinámico `data-theme` en el contenedor principal
- Transiciones suaves entre temas

### 3. **Sistema de Variables CSS Globales** (`src/styles/globals.css`)
Se han definido variables CSS personalizadas para ambos temas:

#### **Modo Oscuro (default)**
```css
:root {
  --bg-primary: #020b08;
  --bg-secondary: #0a1f1a;
  --bg-tertiary: #112a24;
  --text-primary: #FFFFFF;
  --text-secondary: #A0A0A0;
  --text-tertiary: #5a6a65;
  --border-color: #1a2e29;
  --accent-color: #00E676;
  --accent-hover: #00C853;
  --input-bg: #0f2420;
  --input-border: #1a3a35;
  --shadow-color: rgba(0, 0, 0, 0.3);
}
```

#### **Modo Claro**
```css
[data-theme="light"] {
  --bg-primary: #F5F5F5;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #F0F0F0;
  --text-primary: #000000;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --border-color: #E0E0E0;
  --accent-color: #00C853;
  --accent-hover: #00B348;
  --input-bg: #FFFFFF;
  --input-border: #D0D0D0;
  --shadow-color: rgba(0, 0, 0, 0.1);
}
```

### 4. **Actualización de HTML** (`index.html`)
- Script inline que establece el tema inicial antes de que Vue renderice
- Previene parpadeo al cargar la página

### 5. **Componentes Actualizados**
Los siguientes componentes han sido actualizados para usar variables CSS:
- ✅ `src/components/CurrencyConverter.vue`
- ✅ `src/views/ConverterView.vue`
- ~ `src/views/AuthView.vue` (pendiente de actualización completa)
- ~ Otros componentes pueden necesitar revisión

## Cómo Usar

### Para el Usuario
1. Presionar el botón 🌙/☀️ en la navbar para cambiar entre temas
2. La preferencia se guarda automáticamente en el navegador

### Para los Desarrolladores
Para usar el tema en cualquier componente:

```javascript
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()

// Ver tema actual
console.log(themeStore.theme) // 'dark' o 'light'

// Cambiar tema
themeStore.toggleTheme()

// Establecer tema específico
themeStore.setTheme('light')
```

Para usar variables CSS en estilos:
```css
<style scoped>
.elemento {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.elemento:hover {
  background-color: var(--bg-secondary);
  color: var(--accent-color);
}
</style>
```

## Transiciones Suaves

Las variables CSS incluyen transiciones automáticas:
```css
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
```

Esto asegura que los cambios de tema sean suave y agradables a la vista.

## Persistencia

El tema seleccionado se guarda en `localStorage` con la clave `'theme'`, por lo que:
- La preferencia del usuario se mantiene entre sesiones
- No se requiere autenticación para guardar la preferencia
- Se puede eliminar manualmente desde DevTools si es necesario

## Próximos Pasos

Para completar la integración del tema en toda la aplicación:

1. Actualizar todos los componentes que usen colores hardcodeados
2. Reemplazar colores específicos con variables CSS
3. Revisar componentes como:
   - `AuthView.vue`
   - `RecipientForm.vue`
   - `TransactionCard.vue`
   - `HistoryList.vue`
   - Todas las vistas (Dashboard, Profile, Transfer, etc.)

## Archhivos Modificados

```
src/
  App.vue (✅ actualizado)
  main.js (✅ actualizado)
  stores/
    themeStore.js (✅ nuevo)
    counter.js (sin cambios)
  components/
    CurrencyConverter.vue (✅ actualizado)
  views/
    ConverterView.vue (✅ actualizado)
  styles/
    globals.css (✅ nuevo)

index.html (✅ actualizado)
```

## Notas Técnicas

- El sistema usa Pinia (ya disponible en el proyecto)
- Las transiciones CSS se aplican globalmente
- El atributo `data-theme` es la fuente única de verdad para el tema
- Compatible con todos los navegadores modernos
- Mobile-friendly con soporte táctil para el botón de cambio

# MoneyLink 💸

Aplicación web para el envío de remesas internacionales que permite a los usuarios convertir divisas en tiempo real, gestionar destinatarios y realizar seguimiento de transacciones de forma segura y transparente.

## Descripción

MoneyLink es una aplicación fintech (aplicación perteneciente al sector financial technology) desarrollada con Vue 3 + Vite, diseñada para simular y gestionar transferencias internacionales con análisis de mercado, perfiles persistentes y destinatarios frecuentes. El proyecto combina frontend moderno, persistencia local, APIs de divisas y un sistema de diseño propio basado en Glassmorphism que permite:

-  Seleccionar países de origen y destino
-  Convertir divisas en tiempo real con tasas actualizadas
-  Registrarse e iniciar sesión de forma segura
-  Gestionar perfiles de remitentes y destinatarios
-  Autollenar datos en futuros envíos
-  Editar y eliminar perfiles guardados
-  Visualizar historial de transacciones
-  Consultar gráficos de tasas de cambio
-  Proteger datos sensibles con enmascarado

## Características Principales

- **Conversión en Tiempo Real**: Integración con APIs externas para obtener tasas de cambio actualizadas
- **Gestión de Destinatarios**: Guarda y administra múltiples destinatarios para envíos rápidos
- **Historial de Transacciones**: Visualiza todas tus transacciones completadas
- **Autenticación Segura**: Sistema de registro e inicio de sesión
- **Persistencia de Datos**: Base de datos JSON con JSON Server
- **Validaciones Robustas**: Verificación de datos en formularios
- **Interfaz Moderna**: Diseño con efecto glassmorphism y tema personalizable
- **Análisis Inteligente**: Recomendaciones del modelo Gemini AI sobre el mejor momento para enviar dinero
- **Responsive**: Adaptable a diferentes dispositivos

## Tecnologías Utilizadas

- **Frontend**: Vue 3 (Composition API)
- **Enrutamiento**: Vue Router 5
- **Estado Global**: Pinia
- **Gráficos**: Chart.js
- **Backend Mock**: JSON Server
- **Build Tool**: Vite
- **Testing**: Vitest + Vue Test Utils
- **Estilos**: CSS3 con Glassmorphism

### Chart.js

[Chart.js](https://www.chartjs.org/) es una librería JavaScript de código abierto para crear gráficos interactivos y responsivos. En MoneyLink se utiliza para visualizar la evolución de las tasas de cambio entre divisas mediante gráficos de líneas, permitiendo a los usuarios analizar las tendencias del mercado de forma visual e intuitiva. La librería ofrece alto rendimiento, personalización completa y es compatible con Vue 3 a través de composables personalizados.
### Análisis Inteligente con Gemini AI

MoneyLink integra el modelo **Gemini 2.0 Flash** de Google para proporcionar análisis inteligente de las tasas de cambio. A través del composable `useExchangeChartAI.js`, la aplicación:

- **Analiza datos en tiempo real**: Evalúa tendencias, volatilidad y promedios históricos de tasas de cambio
- **Genera recomendaciones**: Proporciona respuestas claras sobre si es un buen momento para enviar dinero
- **Incluye fallback local**: Si falla la conexión a la API, genera análisis local basado en algoritmos
- **Extrae métricas clave**: 
  - Tasa actual vs. tasa anterior
  - Tendencia (alcista, bajista o estable)
  - Rango de volatilidad
  - Tasa promedio del período
  
La IA evalúa estos parámetros y proporciona un análisis profesional en lenguaje natural, ayudando a los usuarios a tomar decisiones informadas sobre cuándo realizar sus transferencias internacionales.
## Instalación y Configuración

### Requisitos Previos

- Node.js >= 20.19.0 || >= 22.12.0
- npm (incluido con Node.js)

### Pasos de Instalación

1. **Clonar el repositorio**
```sh
git clone https://github.com/alvarezmarlen/MoneyLink.git
cd MoneyLink
```

2. **Instalar dependencias**
```sh
npm install
npm install chart.js
```

3. **Iniciar el servidor de base de datos (en una terminal)**
```sh
npm run server
```
El servidor JSON estará disponible en `http://localhost:3000`

4. **Iniciar el servidor de desarrollo (en otra terminal)**
```sh
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`



## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con hot-reload
- `npm run build` - Compila y minifica para producción
- `npm run preview` - Previsualiza la versión de producción
- `npm run test:unit` - Ejecuta las pruebas unitarias con Vitest
- `npm run server` - Inicia JSON Server en el puerto 3000

## Estructura del Proyecto

```
.
├── db.json
├── index.html
├── jsconfig.json
├── package.json
├── package-lock.json
├── project-context
│   ├── coding_style.md
│   ├── instructions.md
│   ├── kanban.md
│   ├── project-context.md
│   ├── project_context.md
│   └── theme-system.md
├── public
│   └── favicon.ico
├── README.md
├── src
│   ├── App.vue
│   ├── components
│   │   ├── ChartRates.vue
│   │   ├── CurrencyConverter.vue
│   │   ├── HistoryList.vue
│   │   ├── RecipientForm.vue
│   │   ├── RecipientQuickList.vue
│   │   └── TransactionCard.vue
│   ├── composables
│   │   ├── useExchangeChartAI.js
│   │   └── useExchangeChart.js
│   ├── constants
│   │   └── currencies.js
│   ├── main.js
│   ├── router
│   │   └── index.js
│   ├── services
│   │   ├── authService.js
│   │   ├── currencyService.js
│   │   ├── recipientService.js
│   │   └── transactionService.js
│   ├── stores
│   │   ├── counter.js
│   │   └── themeStore.js
│   ├── styles
│   │   └── globals.css
│   ├── __tests__
│   │   ├── App.spec.js
│   │   ├── AuthService.spec.js
│   │   ├── AuthView.spec.js
│   │   ├── CurrencyConverter.spec.js
│   │   ├── documentation.md
│   │   ├── RecipientForm.spec.js
│   │   ├── RecipientService.spec.js
│   │   └── TransactionService.spec.js
│   └── views
│       ├── AuthView.vue
│       ├── ConverterView.vue
│       ├── DashboardView.vue
│       ├── EditRecipientView.vue
│       ├── PaymentView.vue
│       ├── ProfileView.vue
│       ├── RatesView.vue
│       ├── RecipientView.vue
│       ├── SenderView.vue
│       ├── TrackingView.vue
│       └── TransferView.vue
├── us-context
│   ├── template.md
│   ├── US-001.md
│   ├── US-002.md
│   ├── US-003.md
│   ├── US-004.md
│   └── US-005.md
├── vite.config.js
└── vitest.config.js

14 directories, 59 files
```

### Descripción de Carpetas

- **`src/components/`** - Componentes reutilizables de Vue
- **`src/views/`** - Vistas principales de la aplicación (páginas)
- **`src/services/`** - Servicios para comunicación con API y lógica de negocio
- **`src/stores/`** - Stores de Pinia para gestión de estado global
- **`src/router/`** - Configuración de rutas de Vue Router
- **`src/composables/`** - Funciones composables reutilizables
- **`src/constants/`** - Constantes y configuraciones
- **`src/__tests__/`** - Pruebas unitarias
- **`project-context/`** - Documentación del proyecto
- **`us-context/`** - Historias de usuario

## Características de la Interfaz

- **Tema Personalizable**: Cambio entre modo claro y oscuro
- **Efecto Glassmorphism**: Diseño moderno con transparencias
- **Animaciones Suaves**: Transiciones fluidas entre vistas
- **Feedback Visual**: Indicadores de carga y mensajes de estado
- **Responsive Design**: Adaptable a móviles, tablets y desktop

## APIs y Servicios

### Servicios Internos

- **authService**: Gestión de autenticación y sesiones
- **transactionService**: Manejo de transacciones y historial
- **recipientService**: CRUD de destinatarios
- **currencyService**: Conversión de divisas y tasas de cambio

### APIs Externas

- **Frankfurter API**: Obtención de tasas de cambio en tiempo real
- Base URL: `https://api.frankfurter.app/`

## Testing

El proyecto incluye pruebas unitarias para componentes y servicios críticos:

```sh
npm run test:unit
```

Archivos de prueba disponibles:
- `App.spec.js` - Pruebas del componente principal
- `AuthService.spec.js` - Pruebas del servicio de autenticación
- `TransactionService.spec.js` - Pruebas del servicio de transacciones
- `RecipientService.spec.js` - Pruebas del servicio de destinatarios
- Y más...

## Base de Datos

El proyecto utiliza **JSON Server** como backend mock. Los datos se almacenan en `db.json` con las siguientes colecciones:

- **users**: Usuarios registrados
- **recipients**: Destinatarios de remesas
- **transactions**: Historial de transacciones

## Seguridad

- Validación de formularios en cliente
- Enmascarado de datos sensibles (números de cuenta)
- Autenticación requerida para operaciones sensibles
- Almacenamiento seguro en localStorage (solo para desarrollo)

## Roadmap

- [ ] Integración con pasarela de pagos real
- [ ] Notificaciones por email
- [ ] Soporte multiidioma
- [ ] Autenticación de dos factores
- [ ] Modo offline con sincronización

## Configuración del IDE

### Recomendado

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (deshabilitar Vetur si está instalado).

## 🌐 Configuración del Navegador (Recomendada)

### Navegadores basados en Chromium (Chrome, Edge, Brave, etc.):
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Activar Custom Object Formatter en Chrome DevTools](http://bit.ly/object-formatters)

### Firefox:
- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Activar Custom Object Formatter en Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Configuración Personalizada

Ver [Vite Configuration Reference](https://vite.dev/config/) para más opciones de configuración.

##  Licencia

Este proyecto ha sido desarrollado por estudiantes del Bootcamp Peñascal F5 con fines exclusivamente formativos, educativos y no comerciales.

## Colaboradores del Proyecto
Este proyecto ha sido desarrollado de forma colaborativa mediante ramas en GitHub por:

    Gabriel Hernández — GitHub: __________________________

    Naia Arenaza — GitHub: __________________________

    Marlen Álvarez — GitHub: https://github.com/alvarezmarlen/MoneyLink.git

    Mirel Volcán — GitHub: https://github.com/MirelSIG/MoneyLink.git

## 📞 Contacto

- **Repositorio**: [https://github.com/alvarezmarlen/MoneyLink](https://github.com/alvarezmarlen/MoneyLink)
- **Issues**: [https://github.com/alvarezmarlen/MoneyLink/issues](https://github.com/alvarezmarlen/MoneyLink/issues)

---


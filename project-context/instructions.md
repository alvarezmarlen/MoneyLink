# MoneyLink - Instrucciones del Proyecto y Sistema de Diseño

Este documento sirve como referencia principal para el diseño e implementación de la plataforma **MoneyLink**.

## 1. Concepto del Proyecto
Plataforma digital integral para la gestión de remesas que permite al usuario maximizar el valor de sus envíos internacionales. Combina la monitorización en tiempo real del tipo de cambio con una interfaz de planificación logística que muestra la disponibilidad operativa en el país de destino (hora local y estado de la transacción), asegurando una sólida transparencia en la gestión.

## 2. Identidad Visual y Estética

### Paleta de Colores
- **Fondo Principal**: Verde Medianoche Profundo (` #020b08`).
- **Superficies/Tarjetas**: Carbono Esmeralda Oscuro (` #0a1f1a`).
- **Acento Primario**: Verde Menta Neón (` #00E676`).
- **Acento Secundario**: Esmeralda Vibrante (` #00C853`).
- **Texto (Encabezados)**: Blanco Puro (` #FFFFFF`).
- **Texto (Cuerpo/Secundario)**: Gris Pizarra / Plata (` #A0A0A0`).
- **Negativo/Advertencia**: Rojo Intenso (uso moderado).
- **Positivo/Destacado**: Gradiente Verde Neón (`linear-gradient(135deg, #00FF85 0%, #00E676 100%)`).

### Tipografía
- **Fuente Principal**: `Outfit` o `Inter` (Sans-Serif).
- **Estilo de Encabezados**: Negrita, limpio, geométrico.
- **Estilo de Cuerpo**: Peso regular, optimizado para legibilidad.
- **Datos Numéricos**: Uso de cifras tabulares o una Sans-Serif limpia con espaciado consistente para tipos de cambio y valores de moneda.

### Estilo de UI
- **Tema**: Únicamente Modo Oscuro (Dark Mode).
- **Radio de Borde (Border Radius)**: 16px para contenedores principales, 8px para inputs y botones pequeños.
- **Glassmorphism**: Uso de `backdrop-filter: blur(10px)` en tarjetas y superposiciones.
- **Bordes**: Bordes sutiles de 1px usando un verde esmeralda oscuro (`#1a2e29`).
- **Elementos Interactivos**:
    - **Botones**: Fondos verde neón de alto brillo con texto oscuro (`#000000`).
    - **Inputs**: Superficies oscurecidas con resalte verde neón al enfocar.
    - **Efectos Hover**: Resplandor sutil o transiciones ligeras de escala (1.02x).

## 3. Componentes Clave y Funcionalidades

### Barra de Navegación (Navbar)
- **Logo MoneyLink**: Alineado a la izquierda con un icono de moneda/enlace verde.
- **Enlaces**: Simulator, Markets, Rates, History.
- **Acceso/Registro**: "Log In" (texto) y "Sign Up" (Botón Verde Neón).

### Simulador de Transferencia Inteligente
- **Calculadoras**: Campos de entrada/salida paralelos para Envío (USD) y Recepción (EUR/COP).
- **Herramienta de Intercambio**: Icono circular de flechas para invertir monedas.
- **Estado de Tasa**: Indicador en tiempo real que muestra "Updated 2s ago".

### Tarjetas de Información (Impacto Económico Real)
- **Motor de Recomendación**: Badge prominente (ej. "SEND NOW" en verde neón).
- **Indicador de Puntuación**: Puntuación de confianza basada en porcentaje (ej. "94% Score").
- **Métricas Financieras**: Filas comparativas mostrando Tasa Actual vs. Máximo de 30 días.
- **Ahorro Potencial**: Valor monetario destacado para mostrar el "Impacto Real".

### Notas del Analista y Sentimiento del Mercado
- **Cajas de Información**: Secciones con bordes limpios y texto descriptivo sobre tendencias del mercado (ej. "USD is trading 0.8% above its weekly mean").

### Dashboard de Volatilidad
- **Visuales**: Gráficos de barras modernos mostrando tendencias de volatilidad de las últimas 24h.
- **Métricas**: Cambio porcentual y valores de fluctuación en verde neón.

## 4. Estándares de Código (Implementación Visual)
- **Framework**: Vue 3.
- **Estilizado**: Vanilla CSS o SCSS. Evitar frameworks de utilidades estándar como Tailwind a menos que se solicite.
- **Responsividad**: Enfoque Mobile-first, asegurando que el simulador sea usable en todos los tamaños de pantalla.
- **Animaciones**: Uso de transiciones CSS para estados hover y fundidos (fade-ins) sutiles para la entrada de tarjetas.

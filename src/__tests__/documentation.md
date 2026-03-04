# MoneyLink - Documentación

## Resumen de Tareas Completadas

### US-001: Convertidor de Divisas (TK-001-01 a TK-001-11)
Completado en la sesión anterior

### US-002: Autenticación (TK-002-01 a TK-002-09)
Completado en la sesión anterior

### US-003: Proceso de envío de divisas (TK-003-01 a TK-003-07)
TK-003-01: Crear formulario para datos del destinatario y checkbox de destinatario frecuente
TK-003-02: Crear formulario para los datos del remitente
TK-003-03: Implementar apartado de selección de método de pago
TK-003-04: Desarrollar vista de resumen (montos, tipo de cambio, tarifas) y botón de continuar
TK-003-05: Lógica de validación de datos del destinatario y cálculo en tiempo real
TK-003-06: Crear test E2E para validar flujos de transferencia
TK-003-07: Crear test MCP para validar flujos de transferencia

### US-004: Dashboard de transacciones (TK-004-01 a TK-004-09)
TK-004-01: Diseñar interfaz del dashboard
TK-004-02: Implementar servicio de consulta de transacción en curso
TK-004-03: Implementar servicio de historial de transacciones
TK-004-04: Implementar consulta de destinatarios frecuentes
TK-004-05: Desarrollar vista del dashboard
TK-004-06: Implementar navegación al flujo de nueva transacción
TK-004-07: Pruebas funcionales y de integración

### US-005: Edición y modificación de perfil (TK-005-01 a TK-005-08)
TK-005-01: Diseñar interfaz de edición de perfil
TK-005-02: Implementar servicio de actualización de perfil
TK-005-03: Implementar validaciones de datos del usuario
TK-005-04: Desarrollar vista de edición de perfil
TK-005-05: Implementar funcionalidad de edición de usuarios frecuentes
TK-005-06: Pruebas funcionales y de validación

---

## Documentación del Componente AuthView

### Vista General

Esta documentación cubre los componentes de autenticación creados para el proyecto MoneyLink (Tareas TK-002-01 a TK-002-09).

### Archivos Creados/Modificados

| Archivo | Acción | Descripción |
|------|--------|-------------|
| `src/services/authService.js` | Creado | Servicio de autenticación con inicio de sesión, registro, cierre de sesión y almacenamiento de datos de transferencia |
| `src/views/AuthView.vue` | Creado | Vista principal de autenticación con formularios de inicio de sesión y registro |
| `src/views/TransferView.vue` | Creado | Vista provisional (placeholder) para la confirmación de transferencia |
| `src/router/index.js` | Modificado | Rutas añadidas: `/login`, `/register`, `/transfer` |
| `src/components/CurrencyConverter.vue` | Modificado | Se añadió el almacenamiento de datos de transferencia antes del redireccionamiento |
| `src/App.vue` | Modificado | Enlaces de la barra de navegación actualizados para usar el enrutador |
| `src/__tests__/AuthView.spec.js` | Creado | Pruebas E2E para flujos de autenticación |
| `src/__tests__/AuthService.spec.js` | Creado | Pruebas MCP para el servicio de autenticación |

### Funcionalidades Implementadas

#### Formulario de Inicio de Sesión
- Entrada de correo electrónico con validación
- Entrada de contraseña
- Manejo de errores para credenciales inválidas
- Mensaje de éxito tras un inicio de sesión correcto

#### Formulario de Registro
- Entrada de nombre completo
- Entrada de correo electrónico con validación
- Entrada de contraseña (mínimo 8 caracteres)
- Entrada de confirmación de contraseña
- Entrada de número de identificación (DNI/Cédula, mínimo 5 caracteres)
- Manejo de errores por fallos de validación

#### Flujo de Datos de Transferencia
- Datos de transferencia guardados en `localStorage` al ejecutar la transferencia
- Datos de transferencia recuperados al iniciar sesión o registrarse
- Redirección a `/transfer` después de la autenticación con los datos guardados

### Reglas de Validación

| Campo | Regla |
|-------|------|
| Correo Electrónico | Obligatorio, formato de correo válido |
| Contraseña (login) | Obligatorio |
| Contraseña (registro) | Obligatorio, mínimo 8 caracteres |
| Confirmar Contraseña | Debe coincidir con la contraseña |
| Nombre Completo | Obligatorio, mínimo 2 caracteres |
| Número de ID | Obligatorio, mínimo 5 caracteres |

### Mensajes de Error

- El correo electrónico es obligatorio
- Formato de correo electrónico inválido
- La contraseña es obligatoria
- La contraseña debe tener al menos 8 caracteres
- Las contraseñas no coinciden
- El nombre completo es obligatorio
- El número de identificación es obligatorio
- El número de identificación debe tener al menos 5 caracteres
- Credenciales inválidas
- El correo electrónico ya existe

### Estilos de Glassmorphism (Efecto Cristal)

Aplicado a:
- AuthView.vue
- CurrencyConverter.vue
- TransferView.vue

Estilo: `backdrop-filter: blur(10px)` con fondos semitransparentes.

### Pruebas (Testing)

Ejecutar pruebas con:
```bash
npm run test:unit
```

Las 42 pruebas han pasado correctamente:
- 17 pruebas de AuthService (MCP)
- 25 pruebas de AuthView (E2E)

### Usuarios de Prueba (Mock Users)

Para propósitos de prueba:
- Correo: `test@example.com`
- Contraseña: `password123`

### Rutas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Redirige a `/converter` | Inicio |
| `/converter` | ConverterView | Convertidor de divisas |
| `/login` | AuthView | Formulario de inicio de sesión |
| `/register` | AuthView | Formulario de registro |
| `/transfer` | TransferView | Confirmación de transferencia (provisional) |

### Decisiones de Diseño

1. **Arquitectura basada en servicios**: Lógica de autenticación en un servicio independiente.
2. **LocalStorage**: Utilizado para la persistencia de la sesión y los datos de transferencia.
3. **Validación de formularios**: Validación en el lado del cliente antes del envío.
4. **Manejo de errores**: Mensajes de error claros para cada fallo de validación.
5. **Glassmorphism**: Aplicado siguiendo el sistema de diseño del proyecto.
6. **Mobile-first**: Diseño responsivo para todas las vistas.

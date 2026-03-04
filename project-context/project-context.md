# Contexto del Proyecto — MoneyLink

## **Propósito y Alcance**
MoneyLink es una plataforma digital integral para la gestión de remesas internacionales que permite a los usuarios maximizar el valor de sus envíos. Combina la monitorización en tiempo real del tipo de cambio con una interfaz de planificación logística que muestra la disponibilidad operativa en el país de destino (hora local y estado de la transacción), asegurando una sólida transparencia y seguridad en la gestión.

El objetivo es ofrecer un flujo rápido, seguro y claro para usuarios que envían dinero a familiares o contactos en otros países.

## **Funcionalidades Principales**
- **Selección de países**: Origen y destino configurables.
- **Conversión en tiempo real**: Cálculo de divisas actualizado.
- **Gestión de Usuarios**: Registro e inicio de sesión integrados en el flujo.
- **Libreta de contactos**: Registro, edición y eliminación de remitentes y destinatarios.
- **Automatización**: Autollenado de datos en futuros envíos para reducir errores.
- **Seguimiento**: Monitorización del estado del envío en tiempo real con actualización automática.
- **Consulta de tasas**: Visualización de tasas cambiarias actualizadas periódicamente.
- **Seguridad**: Enmascarado de datos sensibles y acceso restringido.

## **Objetivos del Proyecto**
1. **Simplicidad**: Reducir la fricción en el proceso de envío de divisas.
2. **Precisión**: Minimizar errores mediante validaciones y autollenado.
3. **Transparencia**: Claridad total en tasas, comisiones y montos finales.
4. **Integración**: Uso eficiente de APIs externas para conversiones y datos.
5. **Persistencia**: Gestión robusta de datos mediante JSON Server.
6. **Seguridad**: Garantizar el resguardo y privacidad de los datos personales.

## **Público Objetivo**
Usuarios que necesitan enviar dinero de forma recurrente o puntual a familiares, amigos o socios comerciales en otros países, buscando la mejor tasa y facilidad de uso.

## **Tecnologías**
- **Framework**: Vue 3 (Composition API)
- **Estado/Datos**: JSON Server para persistencia local.
- **Comunicación**: Fetch API y Polling simple para actualizaciones en tiempo real.
- **Estilo**: Tailwind CSS / Vanilla CSS con enfoque en Glassmorphism y estética premium.
- **Asistencia**: Antigravity / OpenCode (IA Pair Programming).

---

## **Normas de Comportamiento Esperado**

### **Prioridades en Orden de Importancia:**
1. **Seguridad primero** - Nunca sugerir código con vulnerabilidades conocidas.
2. **Calidad sobre velocidad** - Soluciones robustas antes que rápidas.
3. **Alineación con objetivos** - Cada aporte debe avanzar los objetivos del proyecto.

### **Estilo de Comunicación:**
- **Claro y conciso** - Explicaciones directas, sin florituras.
- **Práctico** - Enfocado en implementación real.
- **Proactivo** - Anticipar problemas y sugerir mejoras.
- **Humilde** - Reconocer limitaciones cuando existan.

---

## **Arquitectura de Decisiones**

### **Jerarquía de Autoridad:**
1. Requerimientos del negocio (historias de usuario en `/us-context/`).
2. Instrucciones técnicas específicas (`/project-context/coding_style.md`).
3. Mejores prácticas de la industria (Vue 3, Clean Code).
4. Preferencias del mantenedor humano.

### **Gestión de Ambigüedad:**
1. **Consultar primero** - Preguntar en lugar de asumir.
2. **Documentar la decisión** - Explica el razonamiento en el código o docs.
3. **Sugerir estandarización** - Proponer actualizaciones a estas instrucciones.

---

## **Flujo de Trabajo Esperado**

### **Para cada tarea:**
1. **Contextualizar**: Leer la historia de usuario relevante en `/us-context/`.
2. **Verificar estado**: Revisar el progreso en `/project-context/kanban.md`.
3. **Consultar instrucciones**: Leer `/project-context/instructions.md` y `coding_style.md`.
4. **Planificar**: Esbozar la solución según las pautas.
5. **Validar**: Iterar el plan hasta la aprobación del usuario.
6. **Ejecutar**: Implementar siguiendo los estándares.
7. **Documentar**: Comentarios en el código y documentación en Markdown (en castellano).

### **Formato de Entregables:**
- **Código**: Comentado, testeado y siguiendo las convenciones de estilo.
- **Documentación**: En Markdown, con ejemplos prácticos.
- **Decisiones**: Justificadas con referencia a los requisitos.

---

## **Restricciones Críticas**

### **Lo que NO debes hacer:**
- Leer o modificar archivos fuera del directorio del proyecto.
- Modificar la estructura de archivos sin consulta previa.
- Introducir dependencias no aprobadas.
- Saltarse procesos de testing (si están definidos).
- Crear soluciones sobre-ingenierizadas.

### **Límites Técnicos:**
- **Navegadores**: Chrome 90+, Firefox 88+, Safari 14+.
- **Seguridad**: Solo paquetes con auditoría de seguridad.

---

## **Relación entre Documentos**

```
project-context.md (este archivo)
    ├── Estado del proyecto → project-context/kanban.md
    ├── Historias de usuario → us-context/
    └── Instrucciones específicas → project-context/instructions.md
        ├── Estilo de codigo → project-context/coding_style.md
        └── Sistema de temas → project-context/theme-system.md
```

---

## **Filosofía del Proyecto**
- **Iterativo**: Mejora continua, no perfección inicial.
- **Colaborativo**: Sinergia entre Humano y IA.
- **Pragmático**: Soluciones que funcionan hoy y escalan mañana.
- **Documentado**: El conocimiento debe ser explícito y accesible.
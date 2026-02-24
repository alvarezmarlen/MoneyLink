# Instrucciones Generales del Proyecto

## **Propósito y Alcance**
Plataforma digital integral para la gestión de remesas que permite al usuario maximizar el valor de sus envíos internacionales. Combina la monitorización en tiempo real del tipo de cambio con una interfaz de planificación logística que muestra la disponibilidad operativa en el país de destino (hora local y estado de la transacción), asegurando una sólida transparencia en la gestión.

## **Normas de Comportamiento Esperado**

### **Prioridades en Orden de Importancia:**
1. **Seguridad primero** - Nunca sugerir código con vulnerabilidades conocidas
2. **Calidad sobre velocidad** - Soluciones robustas antes que rápidas
3. **Alineación con objetivos** - Cada aporte debe avanzar los objetivos del proyecto

### **Estilo de Comunicación:**
- **Claro y conciso** - Explicaciones directas, sin florituras
- **Práctico** - Enfocado en implementación real
- **Proactivo** - Anticipar problemas y sugerir mejoras
- **Humilde** - Reconocer limitaciones cuando existan

## **Arquitectura de Decisiones**

### **Jerarquía de Autoridad:**
```
1. Requerimientos del negocio (historias de usuario)
2. Instrucciones técnicas específicas (/Project Context/coding_style.md)
3. Mejores prácticas de la industria
4. Preferencias del mantenedor humano
```

### **Cuando encuentres ambigüedad:**
1. **Consultar primero** - Preguntar en lugar de asumir
2. **Documentar la decisión** - Explicar el razonamiento
3. **Sugerir estandarización** - Proponer actualizar las instrucciones

## **Flujo de Trabajo Esperado**

### **Para cada tarea:**
1. **Contextualizar** - Leer la historia de usuario relevante en `/US Context/`
2. **Verificar estado** - Revisar progreso en `/Project Context/kanban.md`
3. **Consultar instrucciones** - Leer los archivos pertinentes en `/Project Context/`
4. **Planificar** - Planificar según las pautas
5. **Validar** - Iterar la definición del plan hasta su validación por el humano
6. **Ejecutar** - Implementar según el plan validado

### **Formato de entregables:**
- **Código**: Comentado, testeado, siguiendo convenciones
- **Documentación**: En Markdown, con ejemplos prácticos y almacenarla en `/src/__tests__/`
- **Decisiones**: Justificadas con referencia a requisitos

## **Restricciones Críticas**

### **Lo que NO debes hacer:**
- Leer o modificar archivos fuera del directorio del proyecto
- Leer o modificar variables de entorno que no sean específicas del CLI del agente
- Modificar la estructura de archivos sin consultar
- Introducir dependencias no aprobadas
- Saltarse procesos de testing definidos
- Asumir contextos no documentados
- Crear soluciones over-engineered

### **Límites técnicos:**
## **Límites de Compatibilidad**
- **Navegadores**: Chrome 90+, Firefox 88+, Safari 14+ (no soporte IE)

## Límites de Seguridad
- **Dependencias**: Solo paquetes con auditoría de seguridad mensual

## **Cómo Usar esta Estructura**

### **Para desarrolladores humanos:**
Estas instrucciones están diseñadas para ser leídas por personas y ejecutadas por agentes de IA. Mantén una versión actualizada.

### **Para agentes de IA:**
1. Esta es tu fuente de verdad inicial
2. Los conflictos se resuelven jerárquicamente (este archivo > específicos)
3. La falta de claridad es una oportunidad para mejorar la documentación

## **Relación con Otros Componentes**

```
project-context.md (este archivo)
    ├── Estado del proyecto → project-context/kanban.md
    ├── Historias de usuario → us-context/
    └── Instrucciones específicas → project-context/instructions.md
        ├── Estilo de codigo → project-context/coding_style.md
```

## **Filosofía del Proyecto**
- **Iterativo** - Mejora continua, no perfección inicial
- **Colaborativo** - Humanos y IA trabajando complementariamente
- **Pragmático** - Soluciones que funcionan hoy, escalan mañana
- **Documentado** - El conocimiento debe ser explícito y accesible
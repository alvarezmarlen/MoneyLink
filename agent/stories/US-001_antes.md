# Historia de Usuario

## ID
US-001

## Título
Visualizar y seleccionar países de origen y destino

## Descripción
**Como** Usuario que envía remesas internacionales
**Quiero** visualizar la lista de países disponibles y seleccionar el país de origen y el país de destino
**Para** iniciar el proceso de envío de dinero correctamente.

## Criterios de Aceptación

### Escenario 1: Visualización inicial de países
```gherkin
Dado que el usuario ingresa al sitio web
Cuando la página principal se carga correctamente
Entonces el sistema muestra una lista desplegable de países de origen
Y muestra una lista desplegable de países de destino
```

### Escenario 2: Selección de países
```gherkin
Dado que el usuario visualiza las listas de países
Cuando selecciona un país de origen y un país de destino
Entonces el sistema guarda temporalmente la selección
Y habilita el siguiente paso del proceso (conversión o ingreso de monto)
```

## Notas
1. La lista de países puede ser estática en el MVP o provenir de una API.
2. No se debe permitir seleccionar el mismo país como origen y destino.
3. Las selecciones deben mantenerse durante la sesión del usuario.

## Estimación
M

## Prioridad
Alta

## Tareas
| Código | Nombre | Responsable |
|--------|--------|-------------|
| TK-001-01 | Definir lista de países soportados | 
| TK-001-02 | Crear componente selector de país (origen) | 
| TK-001-03 | Crear componente selector de país (destino) |
| TK-001-04 | Implementar validación (origen ≠ destino) | 
| TK-001-05 | Guardar selección en sesión | 
| TK-001-06 | Pruebas funcionales de selección | 

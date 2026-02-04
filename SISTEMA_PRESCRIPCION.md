# 📋 SISTEMA DE PRESCRIPCIÓN DE EJERCICIOS - GIMNASIO VIGOROSO

## 🎯 Resumen de la Implementación

Basado en el documento **"PRESCRIPCIÓN DE AIDE GONZALEZ"**, se ha implementado un sistema completo para manejar planes de entrenamiento con el siguiente formato:

### Estructura del Plan:
```
RUTINA DIARIA (todos los días):
- 10 minutos de cardio
- Movilidad articular

DÍA 1 - DÍA 6: 
- 5-6 ejercicios por día
- Formatos variables de series y repeticiones
- Superseries y ejercicios combinados
- Ejercicios con tiempo
- Solo descripciones (estiramientos)
```

---

## 🗄️ Cambios en la Base de Datos

### 1. Nueva Columna en `planes_entrenamiento`:
```sql
rutina_diaria TEXT
```
Almacena la rutina que se ejecuta todos los días (cardio, movilidad, etc.)

### 2. Nuevas Columnas en `ejercicios_plan`:

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `es_rutina_diaria` | BOOLEAN | Marca si es parte de rutina diaria | `TRUE/FALSE` |
| `ejercicio_secundario` | VARCHAR(200) | Para superseries | `"push down"` |
| `series_secundario` | VARCHAR(50) | Series del 2do ejercicio | `"4"` |
| `repeticiones_secundario` | VARCHAR(50) | Reps del 2do ejercicio | `"15"` |
| `tipo_ejercicio` | ENUM | Tipo de ejercicio | `'superserie'` |
| `categoria_id` | INT | Categoría del ejercicio | `1` (Espalda) |

### 3. Tipos de Ejercicio Soportados:

```sql
ENUM('normal', 'superserie', 'tiempo', 'solo_descripcion')
```

- **normal**: Ejercicio estándar (ej: "Dominadas 4-10")
- **superserie**: Dos ejercicios sin descanso (ej: "Press mancuerna + push down")
- **tiempo**: Ejercicios medidos en tiempo (ej: "Plancha 4-1'")
- **solo_descripcion**: Sin series/reps (ej: "Estiramientos para pectoral")

### 4. Nueva Tabla `categorias_ejercicios`:

```sql
CREATE TABLE categorias_ejercicios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    descripcion TEXT,
    color VARCHAR(7)
);
```

**Categorías incluidas:**
- 🔵 Espalda (#3B82F6)
- 🟢 Piernas (#10B981)
- 🟠 Pecho (#F59E0B)
- 🩷 Glúteo (#EC4899)
- 🟣 Core (#8B5CF6)
- 🔴 Cardio (#EF4444)
- 🟦 Movilidad (#6366F1)
- 🟧 Brazos (#F97316)

---

## 📂 Archivos Creados/Modificados

### Backend:

#### **1. Scripts de Migración:**
```
backend/scripts/
├── migracion_prescripcion.sql          # SQL de migración
├── ejecutarMigracion.js                # Ejecutor de migración
└── importarPlanPrescripcion.js         # Importador de ejemplo
```

#### **2. Controladores Actualizados:**
```
backend/controllers/
└── entrenamientoController.js          # Soporta nuevos campos
```

**Cambios principales:**
- `guardarPlanEntrenamiento()` ahora acepta `rutina_diaria`
- Mapeo actualizado para incluir todos los nuevos campos
- Soporte para superseries y ejercicios combinados

---

## 🚀 Cómo Usar el Sistema

### **Paso 1: Ejecutar Migración**

```bash
cd backend

# Ejecutar migración de base de datos
node scripts/ejecutarMigracion.js
```

**Salida esperada:**
```
✅ Migración completada exitosamente

📊 Cambios aplicados:
   ✓ Campo rutina_diaria agregado
   ✓ Campos mejorados en ejercicios_plan
   ✓ Tabla de categorías creada
   ✓ Índices de optimización agregados
```

### **Paso 2: Importar Plan de Ejemplo**

Editar `backend/scripts/importarPlanPrescripcion.js`:

```javascript
// CAMBIAR ESTOS VALORES:
const participanteEmail = 'aide.gonzalez@ejemplo.com';
const mesAño = '2024-02';
const creadorEmail = 'admin@gmail.com';
```

Ejecutar:
```bash
node scripts/importarPlanPrescripcion.js
```

**Salida esperada:**
```
✅ Plan importado exitosamente!
📊 Total de ejercicios: 32
👤 Participante ID: 1
📅 Mes: 2024-02
📝 Rutina diaria configurada
```

---

## 📋 Formato de Datos

### **Ejemplo de Plan Completo:**

```javascript
{
  "participante_id": 1,
  "mes_año": "2024-02",
  "rutina_diaria": "10 minutos de cardio\nMovilidad articular",
  "ejercicios": [
    // Ejercicio Normal
    {
      "dia_semana": "Lunes",
      "orden": 1,
      "nombre_ejercicio": "Dominadas",
      "series": "4",
      "repeticiones": "10",
      "tipo_ejercicio": "normal"
    },
    
    // Superserie
    {
      "dia_semana": "Miércoles",
      "orden": 2,
      "nombre_ejercicio": "Press mancuerna",
      "ejercicio_secundario": "push down",
      "series": "4",
      "repeticiones": "15",
      "tipo_ejercicio": "superserie"
    },
    
    // Con tiempo
    {
      "dia_semana": "Viernes",
      "orden": 3,
      "nombre_ejercicio": "Plancha",
      "series": "4",
      "repeticiones": "1'",
      "tipo_ejercicio": "tiempo"
    },
    
    // Series variables
    {
      "dia_semana": "Martes",
      "orden": 1,
      "nombre_ejercicio": "Sentadilla en Haka",
      "series": "2-12 2-15 1-12",
      "repeticiones": "",
      "tipo_ejercicio": "normal",
      "notas": "Series y reps variables"
    },
    
    // Solo descripción
    {
      "dia_semana": "Viernes",
      "orden": 1,
      "nombre_ejercicio": "Estiramientos",
      "tipo_ejercicio": "solo_descripcion",
      "notas": "Para: Pectoral, psoas iliaco, lumbar y piramidal"
    }
  ]
}
```

---

## 🎨 Interfaz de Usuario (Frontend)

### **Vista del Entrenador:**

El componente `TrainingPlanManager` ahora debe mostrar:

```
┌─────────────────────────────────────────┐
│ Plan de Entrenamiento - Febrero 2024   │
│                           [Editar Plan] │
├─────────────────────────────────────────┤
│ 📝 Rutina Diaria (todos los días):     │
│ ┌─────────────────────────────────────┐ │
│ │ 10 minutos de cardio               │ │
│ │ Movilidad articular                │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ ▼ Lunes                                 │
│   1. Dominadas                   4 x 10│
│   2. Halones cerrados           4 x 15│
│   3. Pullover                    3 x 15│
│   4. Press mancuerna + push down 4 x 15│ ← Superserie
│                                          │
│ ▼ Martes                                │
│   1. Sentadilla en Haka                │
│      Series: 2-12 2-15 1-12            │ ← Variable
│   2. Zancada                     4 x 10│
│                                          │
│ ▼ Viernes                               │
│   1. Estiramientos                      │ ← Solo descripción
│      (Pectoral, psoas iliaco...)        │
│   2. Plancha                   4 x 1min│ ← Con tiempo
└─────────────────────────────────────────┘
```

### **Vista del Participante:**

```
┌─────────────────────────────────────────┐
│ Mi Entrenamiento - 03/02/2024          │
├─────────────────────────────────────────┤
│ 💪 Rutina Diaria:                       │
│ ✓ 10 min cardio  ✓ Movilidad articular│
├─────────────────────────────────────────┤
│ ▼ Lunes                                 │
│   Dominadas (4 x 10)                    │
│   Peso usado: [50] kg ✓                │
│   Notas: Gran sesión hoy                │
│   📊 Ver Historial                      │
│                                          │
│   Press mancuerna + push down           │ ← Superserie
│   4 x 15 cada uno                       │
│   Peso: [20] kg  [30] kg               │
└─────────────────────────────────────────┘
```

---

## 📊 Consultas SQL Útiles

### **1. Ver plan completo de un participante:**
```sql
SELECT 
    pe.mes_año,
    pe.rutina_diaria,
    ep.*
FROM planes_entrenamiento pe
JOIN ejercicios_plan ep ON pe.id = ep.plan_id
WHERE pe.participante_id = 1 
  AND pe.mes_año = '2024-02'
ORDER BY 
    FIELD(ep.dia_semana, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'),
    ep.orden;
```

### **2. Ver superseries del plan:**
```sql
SELECT 
    dia_semana,
    CONCAT(nombre_ejercicio, ' + ', ejercicio_secundario) as superserie,
    series,
    repeticiones
FROM ejercicios_plan
WHERE plan_id = 1 
  AND tipo_ejercicio = 'superserie';
```

### **3. Contar ejercicios por categoría:**
```sql
SELECT 
    c.nombre as categoria,
    COUNT(ep.id) as total_ejercicios
FROM ejercicios_plan ep
JOIN categorias_ejercicios c ON ep.categoria_id = c.id
WHERE ep.plan_id = 1
GROUP BY c.nombre;
```

---

## 🔧 Validaciones Recomendadas

### **Backend:**
```javascript
// Validar superseries
if (tipo_ejercicio === 'superserie' && !ejercicio_secundario) {
  throw new Error('Superserie requiere ejercicio secundario');
}

// Validar ejercicios con tiempo
if (tipo_ejercicio === 'tiempo' && !repeticiones.match(/['"]/)) {
  throw new Error('Ejercicios de tiempo deben incluir unidad');
}
```

### **Frontend:**
```javascript
// Mostrar campo secundario solo en superseries
{tipoEjercicio === 'superserie' && (
  <input 
    placeholder="Ejercicio secundario"
    value={ejercicioSecundario}
  />
)}
```

---

## 🎯 Ejemplos de Uso

### **Crear plan desde cero (API):**

```javascript
POST /api/entrenamiento/plan
Content-Type: application/json
Authorization: Bearer {token}

{
  "participante_id": 1,
  "mes_año": "2024-02",
  "rutina_diaria": "10 min cardio\nMovilidad articular",
  "ejercicios": [
    {
      "dia_semana": "Lunes",
      "orden": 1,
      "nombre_ejercicio": "Dominadas",
      "series": "4",
      "repeticiones": "10",
      "tipo_ejercicio": "normal",
      "categoria_id": 1
    }
    // ... más ejercicios
  ]
}
```

---

## 📱 Próximas Mejoras Sugeridas

1. **Editor Visual de Planes:**
   - Drag & drop para reordenar ejercicios
   - Plantillas predefinidas
   - Copiar días completos

2. **Biblioteca de Ejercicios:**
   - Base de datos de ejercicios comunes
   - Videos e imágenes de referencia
   - Músculos trabajados

3. **Análisis de Volumen:**
   - Calcular volumen total por sesión
   - Gráficos de distribución muscular
   - Balanceo de grupos musculares

4. **Importación Automática:**
   - Subir PDF y extraer ejercicios con OCR
   - Plantillas de Excel
   - Copiar/pegar desde texto

---

## ✅ Checklist de Implementación

- [x] Script de migración SQL
- [x] Ejecutor de migración en Node.js
- [x] Controlador actualizado
- [x] Script de importación de ejemplo
- [x] Documentación completa
- [ ] Componente frontend actualizado
- [ ] Formulario de edición mejorado
- [ ] Vista de participante actualizada
- [ ] Tests unitarios
- [ ] Validaciones completas

---

## 🆘 Troubleshooting

### **Error: "Unknown column 'rutina_diaria'"**
**Solución:** Ejecutar migración:
```bash
node scripts/ejecutarMigracion.js
```

### **Error al guardar superserie**
**Solución:** Verificar que el tipo_ejercicio sea 'superserie' y ejercicio_secundario esté definido

### **No se ven las categorías**
**Solución:** Verificar que la tabla categorias_ejercicios tenga datos:
```sql
SELECT * FROM categorias_ejercicios;
```

---

**Versión:** 2.0.0  
**Fecha:** Febrero 2024  
**Sistema:** VIGOROSO Gym Management  

🏋️ **¡Sistema listo para manejar cualquier tipo de prescripción de ejercicios!**

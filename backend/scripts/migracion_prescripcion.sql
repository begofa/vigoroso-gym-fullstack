-- Migración para soportar prescripción de ejercicios mejorada
USE vigoroso_gym;

-- 1. Agregar campo de rutina diaria al plan de entrenamiento
ALTER TABLE planes_entrenamiento 
ADD COLUMN rutina_diaria TEXT COMMENT 'Rutina que se ejecuta todos los días (ej: cardio, movilidad)' AFTER notas;

-- 2. Modificar tabla de ejercicios para soportar formato flexible
ALTER TABLE ejercicios_plan 
MODIFY COLUMN series VARCHAR(50) COMMENT 'Puede ser: "4-10", "2-12 2-15", etc.',
MODIFY COLUMN repeticiones VARCHAR(50) COMMENT 'Puede ser: "15", "1min", "30seg", etc.',
ADD COLUMN tipo_ejercicio ENUM('normal', 'superserie', 'tiempo', 'solo_descripcion') DEFAULT 'normal' AFTER repeticiones,
ADD COLUMN ejercicio_secundario VARCHAR(200) COMMENT 'Para superseries o ejercicios combinados' AFTER nombre_ejercicio,
ADD COLUMN series_secundario VARCHAR(50) COMMENT 'Series del ejercicio secundario' AFTER ejercicio_secundario,
ADD COLUMN repeticiones_secundario VARCHAR(50) COMMENT 'Repeticiones del ejercicio secundario' AFTER series_secundario;

-- 3. Agregar campo para diferenciar ejercicios de rutina diaria
ALTER TABLE ejercicios_plan
ADD COLUMN es_rutina_diaria BOOLEAN DEFAULT FALSE COMMENT 'Indica si es parte de la rutina diaria' AFTER orden;

-- 4. Crear vista mejorada para planes de entrenamiento
CREATE OR REPLACE VIEW vista_planes_completos AS
SELECT 
    pe.id as plan_id,
    pe.participante_id,
    p.nombre as participante_nombre,
    pe.mes_año,
    pe.rutina_diaria,
    pe.notas,
    pe.fecha_creacion,
    u.nombre as creado_por_nombre,
    COUNT(DISTINCT ep.dia_semana) as dias_con_ejercicios,
    COUNT(ep.id) as total_ejercicios
FROM planes_entrenamiento pe
LEFT JOIN participantes p ON pe.participante_id = p.id
LEFT JOIN usuarios u ON pe.creado_por = u.id
LEFT JOIN ejercicios_plan ep ON pe.id = ep.plan_id
WHERE p.activo = TRUE
GROUP BY pe.id;

-- 5. Crear tabla de categorías de ejercicios (opcional para futuro)
CREATE TABLE IF NOT EXISTS categorias_ejercicios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    color VARCHAR(7) COMMENT 'Código de color hexadecimal para UI'
);

-- Insertar categorías comunes
INSERT INTO categorias_ejercicios (nombre, descripcion, color) VALUES
('Espalda', 'Ejercicios para músculos de la espalda', '#3B82F6'),
('Piernas', 'Ejercicios para tren inferior', '#10B981'),
('Pecho', 'Ejercicios para pectorales', '#F59E0B'),
('Glúteo', 'Ejercicios específicos para glúteos', '#EC4899'),
('Core', 'Ejercicios de abdomen y core', '#8B5CF6'),
('Cardio', 'Ejercicios cardiovasculares', '#EF4444'),
('Movilidad', 'Ejercicios de movilidad y estiramiento', '#6366F1'),
('Brazos', 'Ejercicios para bíceps y tríceps', '#F97316')
ON DUPLICATE KEY UPDATE nombre = nombre;

-- 6. Opcional: Agregar relación de ejercicios con categorías
ALTER TABLE ejercicios_plan
ADD COLUMN categoria_id INT NULL AFTER tipo_ejercicio,
ADD FOREIGN KEY (categoria_id) REFERENCES categorias_ejercicios(id) ON DELETE SET NULL;

-- 7. Crear índices para mejorar performance
CREATE INDEX idx_ejercicios_tipo ON ejercicios_plan(tipo_ejercicio);
CREATE INDEX idx_ejercicios_rutina_diaria ON ejercicios_plan(es_rutina_diaria);

-- Verificación
SELECT 'Migración completada exitosamente' as resultado;
SELECT COUNT(*) as total_categorias FROM categorias_ejercicios;

const { pool } = require('../config/database');
require('dotenv').config();

/**
 * Script para importar un plan de entrenamiento en formato de prescripción
 * Basado en el formato del documento "PRESCRIPCIÓN DE AIDE GONZALEZ"
 */

async function importarPlanPrescripcion() {
  const connection = await pool.getConnection();

  try {
    console.log('📋 Importando plan de entrenamiento...\n');

    // Datos del plan a importar
    const participanteEmail = 'fabraidee@gmail.com'; // CAMBIAR POR EMAIL REAL
    const mesAño = '2026-02'; // CAMBIAR POR MES DESEADO
    const creadorEmail = 'admin@gmail.com'; // Email del entrenador

    // Buscar participante
    const [participantes] = await connection.query(
      'SELECT id FROM participantes WHERE email = ? AND activo = TRUE',
      [participanteEmail]
    );

    if (participantes.length === 0) {
      console.error('❌ Participante no encontrado con email:', participanteEmail);
      console.log('💡 Primero debes crear el participante en el sistema');
      process.exit(1);
    }

    const participanteId = participantes[0].id;

    // Buscar creador
    const [usuarios] = await connection.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [creadorEmail]
    );

    const creadorId = usuarios.length > 0 ? usuarios[0].id : null;

    await connection.beginTransaction();

    // Rutina diaria
    const rutinaDiaria = `10 minutos de cardio
Movilidad articular`;

    // Verificar si existe plan
    const [planesExistentes] = await connection.query(
      'SELECT id FROM planes_entrenamiento WHERE participante_id = ? AND mes_año = ?',
      [participanteId, mesAño]
    );

    let planId;

    if (planesExistentes.length > 0) {
      planId = planesExistentes[0].id;
      await connection.query(
        'UPDATE planes_entrenamiento SET rutina_diaria = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?',
        [rutinaDiaria, planId]
      );
      await connection.query('DELETE FROM ejercicios_plan WHERE plan_id = ?', [planId]);
      console.log('✓ Plan existente actualizado');
    } else {
      const [result] = await connection.query(
        'INSERT INTO planes_entrenamiento (participante_id, mes_año, creado_por, rutina_diaria) VALUES (?, ?, ?, ?)',
        [participanteId, mesAño, creadorId, rutinaDiaria]
      );
      planId = result.insertId;
      console.log('✓ Nuevo plan creado');
    }

    // Definir ejercicios según el documento
    const ejerciciosPlan = [
      // DÍA 1 - Espalda y Bíceps
      { dia: 'Lunes', orden: 1, nombre: 'Dominadas', series: '4', reps: '10', tipo: 'normal' },
      { dia: 'Lunes', orden: 2, nombre: 'Halones cerrados', series: '4', reps: '15', tipo: 'normal' },
      { dia: 'Lunes', orden: 3, nombre: 'Pullover', series: '3', reps: '15', tipo: 'normal' },
      { dia: 'Lunes', orden: 4, nombre: 'Remo mancuerna', series: '3', reps: '12', tipo: 'normal' },
      { dia: 'Lunes', orden: 5, nombre: 'Curl de biceps mancuerna', series: '3', reps: '15', tipo: 'normal' },
      { dia: 'Lunes', orden: 6, nombre: 'Predicador', series: '3', reps: '15', tipo: 'normal' },

      // DÍA 2 - Piernas
      { dia: 'Martes', orden: 1, nombre: 'Sentadilla en Haka', series: '2-12 2-15 1-12', reps: '', tipo: 'normal', notas: 'Series y reps variables' },
      { dia: 'Martes', orden: 2, nombre: 'Zancada', series: '4', reps: '10', tipo: 'normal' },
      { dia: 'Martes', orden: 3, nombre: 'Sentadilla en smith', series: '4', reps: '10', tipo: 'normal' },
      { dia: 'Martes', orden: 4, nombre: 'Sentadilla sisi', series: '3', reps: '20', tipo: 'normal' },
      { dia: 'Martes', orden: 5, nombre: 'Extensiones', series: '4', reps: '15', tipo: 'normal' },

      // DÍA 3 - Pecho y Hombros
      { dia: 'Miércoles', orden: 1, nombre: 'Aperturas', series: '3', reps: '15', tipo: 'normal' },
      { dia: 'Miércoles', orden: 2, nombre: 'Press mancuerna', secundario: 'push down', series: '4', reps: '15', tipo: 'superserie' },
      { dia: 'Miércoles', orden: 3, nombre: 'Vuelos laterales', secundario: 'elevaciones frontales', series: '2', reps: '12', series_sec: '2', reps_sec: '10', tipo: 'superserie' },
      { dia: 'Miércoles', orden: 4, nombre: 'Copa', series: '3', reps: '15', tipo: 'normal' },
      { dia: 'Miércoles', orden: 5, nombre: 'Flexiones', series: '4', reps: '12', tipo: 'normal' },

      // DÍA 4 - Piernas y Glúteos
      { dia: 'Jueves', orden: 1, nombre: 'Sentadilla sumo', series: '3', reps: '15', tipo: 'normal' },
      { dia: 'Jueves', orden: 2, nombre: 'Peso muerto', series: '4', reps: '15', tipo: 'normal' },
      { dia: 'Jueves', orden: 3, nombre: 'Leg curl', series: '3', reps: '15', tipo: 'normal' },
      { dia: 'Jueves', orden: 4, nombre: 'Peso muerto unilateral', series: '3', reps: '12', tipo: 'normal' },
      { dia: 'Jueves', orden: 5, nombre: 'Aductor', series: '4', reps: '20', tipo: 'normal' },
      { dia: 'Jueves', orden: 6, nombre: 'Pantorrilla', series: '4', reps: '20', tipo: 'normal' },

      // DÍA 5 - Core y Estiramientos
      { dia: 'Viernes', orden: 1, nombre: 'Estiramientos', series: '', reps: '', tipo: 'solo_descripcion', notas: 'Para: Pectoral, psoas iliaco, lumbar y piramidal' },
      { dia: 'Viernes', orden: 2, nombre: 'Zig zag', series: '3', reps: '15', tipo: 'normal' },
      { dia: 'Viernes', orden: 3, nombre: 'Plancha', series: '4', reps: "1'", tipo: 'tiempo' },
      { dia: 'Viernes', orden: 4, nombre: 'Crunch tocando tobillos', series: '4', reps: '20', tipo: 'normal' },
      { dia: 'Viernes', orden: 5, nombre: 'Planchas laterales', series: '3', reps: "30''", tipo: 'tiempo' },

      // DÍA 6 - Glúteo
      { dia: 'Sábado', orden: 1, nombre: 'Sentadilla Búlgara', series: '2-12 2-15', reps: '', tipo: 'normal', notas: 'Series variables' },
      { dia: 'Sábado', orden: 2, nombre: 'Peso muerto unilateral para glúteo', series: '3', reps: '20', tipo: 'normal' },
      { dia: 'Sábado', orden: 3, nombre: 'Elevaciones pélvicas', series: '4', reps: '12', tipo: 'normal' },
      { dia: 'Sábado', orden: 4, nombre: 'Patada de glúteo en polea', series: '3', reps: '15', tipo: 'normal' },
      { dia: 'Sábado', orden: 5, nombre: 'Abductor', series: '4', reps: '20', tipo: 'normal' }
    ];

    // Insertar ejercicios
    for (const ej of ejerciciosPlan) {
      await connection.query(
        `INSERT INTO ejercicios_plan 
         (plan_id, dia_semana, orden, nombre_ejercicio, ejercicio_secundario, series, series_secundario, 
          repeticiones, repeticiones_secundario, tipo_ejercicio, notas) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          planId,
          ej.dia,
          ej.orden,
          ej.nombre,
          ej.secundario || null,
          ej.series || null,
          ej.series_sec || null,
          ej.reps || null,
          ej.reps_sec || null,
          ej.tipo,
          ej.notas || null
        ]
      );
    }

    await connection.commit();

    console.log('\n✅ Plan importado exitosamente!');
    console.log(`📊 Total de ejercicios: ${ejerciciosPlan.length}`);
    console.log(`👤 Participante ID: ${participanteId}`);
    console.log(`📅 Mes: ${mesAño}`);
    console.log(`📝 Rutina diaria configurada: ${rutinaDiaria}`);
    console.log('\n💡 Puedes ver el plan en la aplicación web');

  } catch (error) {
    await connection.rollback();
    console.error('❌ Error importando plan:', error);
    process.exit(1);
  } finally {
    connection.release();
    await pool.end();
  }
}

// Ejecutar
if (require.main === module) {
  importarPlanPrescripcion()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = importarPlanPrescripcion;

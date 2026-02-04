const { pool } = require('../config/database');

// Obtener plan de nutrición de un participante
exports.obtenerPlanNutricion = async (req, res) => {
  try {
    const { participante_id } = req.params;

    // Obtener el plan activo
    const [planes] = await pool.query(
      `SELECT * FROM planes_nutricion 
       WHERE participante_id = ? AND activo = TRUE
       ORDER BY fecha_creacion DESC
       LIMIT 1`,
      [participante_id]
    );

    if (planes.length === 0) {
      return res.json({ plan: null, comidas: [] });
    }

    const plan = planes[0];

    // Obtener comidas del plan
    const [comidas] = await pool.query(
      `SELECT * FROM comidas_plan 
       WHERE plan_nutricion_id = ?
       ORDER BY FIELD(tipo_comida, 'Desayuno', 'Media Mañana', 'Almuerzo', 'Merienda', 'Cena')`,
      [plan.id]
    );

    res.json({ plan, comidas });
  } catch (error) {
    console.error('Error obteniendo plan de nutrición:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Crear o actualizar plan de nutrición
exports.guardarPlanNutricion = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { participante_id, comidas, recomendaciones_generales } = req.body;

    if (!participante_id || !comidas) {
      await connection.rollback();
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Desactivar planes anteriores
    await connection.query(
      'UPDATE planes_nutricion SET activo = FALSE WHERE participante_id = ?',
      [participante_id]
    );

    // Crear nuevo plan
    const [result] = await connection.query(
      `INSERT INTO planes_nutricion 
       (participante_id, creado_por, recomendaciones_generales, activo) 
       VALUES (?, ?, ?, TRUE)`,
      [participante_id, req.user.id, recomendaciones_generales]
    );

    const planId = result.insertId;

    // Insertar comidas
    if (comidas && comidas.length > 0) {
      const comidasValues = comidas.map(comida => [
        planId,
        comida.tipo_comida,
        comida.opcion_1,
        comida.opcion_2
      ]);

      await connection.query(
        `INSERT INTO comidas_plan 
         (plan_nutricion_id, tipo_comida, opcion_1, opcion_2) 
         VALUES ?`,
        [comidasValues]
      );
    }

    await connection.commit();

    res.json({
      message: 'Plan de nutrición guardado exitosamente',
      plan_id: planId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error guardando plan de nutrición:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    connection.release();
  }
};

// Obtener todos los planes de nutrición de un participante
exports.obtenerHistorialPlanes = async (req, res) => {
  try {
    const { participante_id } = req.params;

    const [planes] = await pool.query(
      `SELECT 
        pn.*,
        u.nombre as creado_por_nombre
       FROM planes_nutricion pn
       LEFT JOIN usuarios u ON pn.creado_por = u.id
       WHERE pn.participante_id = ?
       ORDER BY pn.fecha_creacion DESC`,
      [participante_id]
    );

    res.json(planes);
  } catch (error) {
    console.error('Error obteniendo historial de planes:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar plan de nutrición
exports.eliminarPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM planes_nutricion WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Plan no encontrado' });
    }

    res.json({ message: 'Plan eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando plan:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar plan de nutrición existente
exports.actualizarPlanNutricion = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { comidas, recomendaciones_generales } = req.body;

    // Actualizar plan
    const [result] = await connection.query(
      `UPDATE planes_nutricion 
       SET recomendaciones_generales = ?, fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [recomendaciones_generales, id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Plan no encontrado' });
    }

    // Eliminar comidas antiguas
    await connection.query('DELETE FROM comidas_plan WHERE plan_nutricion_id = ?', [id]);

    // Insertar nuevas comidas
    if (comidas && comidas.length > 0) {
      const comidasValues = comidas.map(comida => [
        id,
        comida.tipo_comida,
        comida.opcion_1,
        comida.opcion_2
      ]);

      await connection.query(
        `INSERT INTO comidas_plan 
         (plan_nutricion_id, tipo_comida, opcion_1, opcion_2) 
         VALUES ?`,
        [comidasValues]
      );
    }

    await connection.commit();

    res.json({ message: 'Plan de nutrición actualizado exitosamente' });
  } catch (error) {
    await connection.rollback();
    console.error('Error actualizando plan de nutrición:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    connection.release();
  }
};

const { pool } = require('../config/database');

// Obtener plan de entrenamiento por participante y mes
exports.obtenerPlanEntrenamiento = async (req, res) => {
  try {
    const { participante_id, mes_año } = req.params;

    // Obtener el plan
    const [planes] = await pool.query(
      `SELECT * FROM planes_entrenamiento 
       WHERE participante_id = ? AND mes_año = ?`,
      [participante_id, mes_año]
    );

    if (planes.length === 0) {
      return res.json({ plan: null, ejercicios: [] });
    }

    const plan = planes[0];

    // Obtener ejercicios del plan
    const [ejercicios] = await pool.query(
      `SELECT * FROM ejercicios_plan 
       WHERE plan_id = ? 
       ORDER BY FIELD(dia_semana, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'), orden`,
      [plan.id]
    );

    res.json({ plan, ejercicios });
  } catch (error) {
    console.error('Error obteniendo plan de entrenamiento:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Crear o actualizar plan de entrenamiento completo
exports.guardarPlanEntrenamiento = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { participante_id, mes_año, ejercicios, rutina_diaria } = req.body;

    if (!participante_id || !mes_año) {
      await connection.rollback();
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Verificar si existe el plan
    const [planesExistentes] = await connection.query(
      'SELECT id FROM planes_entrenamiento WHERE participante_id = ? AND mes_año = ?',
      [participante_id, mes_año]
    );

    let planId;

    if (planesExistentes.length > 0) {
      // Actualizar plan existente
      planId = planesExistentes[0].id;
      await connection.query(
        'UPDATE planes_entrenamiento SET fecha_actualizacion = CURRENT_TIMESTAMP, rutina_diaria = ? WHERE id = ?',
        [rutina_diaria || null, planId]
      );

      // Eliminar ejercicios antiguos
      await connection.query('DELETE FROM ejercicios_plan WHERE plan_id = ?', [planId]);
    } else {
      // Crear nuevo plan
      const [result] = await connection.query(
        'INSERT INTO planes_entrenamiento (participante_id, mes_año, creado_por, rutina_diaria) VALUES (?, ?, ?, ?)',
        [participante_id, mes_año, req.user.id, rutina_diaria || null]
      );
      planId = result.insertId;
    }

    // Insertar nuevos ejercicios
    if (ejercicios && ejercicios.length > 0) {
      const ejerciciosValues = ejercicios.map(ej => [
        planId,
        ej.dia_semana,
        ej.orden,
        ej.es_rutina_diaria || false,
        ej.nombre_ejercicio,
        ej.ejercicio_secundario || null,
        ej.series,
        ej.series_secundario || null,
        ej.repeticiones,
        ej.repeticiones_secundario || null,
        ej.tipo_ejercicio || 'normal',
        ej.categoria_id || null,
        ej.notas
      ]);

      await connection.query(
        `INSERT INTO ejercicios_plan 
         (plan_id, dia_semana, orden, es_rutina_diaria, nombre_ejercicio, ejercicio_secundario, 
          series, series_secundario, repeticiones, repeticiones_secundario, tipo_ejercicio, categoria_id, notas) 
         VALUES ?`,
        [ejerciciosValues]
      );
    }

    await connection.commit();

    res.json({
      message: 'Plan de entrenamiento guardado exitosamente',
      plan_id: planId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error guardando plan de entrenamiento:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    connection.release();
  }
};

// Obtener todos los planes de un participante
exports.obtenerPlanesParticipante = async (req, res) => {
  try {
    const { participante_id } = req.params;

    const [planes] = await pool.query(
      `SELECT 
        pe.*,
        u.nombre as creado_por_nombre
       FROM planes_entrenamiento pe
       LEFT JOIN usuarios u ON pe.creado_por = u.id
       WHERE pe.participante_id = ?
       ORDER BY pe.mes_año DESC`,
      [participante_id]
    );

    res.json(planes);
  } catch (error) {
    console.error('Error obteniendo planes:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar plan de entrenamiento
exports.eliminarPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM planes_entrenamiento WHERE id = ?',
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

// Registrar entrenamiento (log)
exports.registrarEntrenamiento = async (req, res) => {
  try {
    const { participante_id, ejercicio_plan_id, fecha_registro, peso_utilizado, series_completadas, repeticiones_completadas, comentarios } = req.body;

    const [result] = await pool.query(
      `INSERT INTO registros_entrenamiento 
       (participante_id, ejercicio_plan_id, fecha_registro, peso_utilizado, series_completadas, repeticiones_completadas, comentarios)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [participante_id, ejercicio_plan_id, fecha_registro, peso_utilizado, series_completadas, repeticiones_completadas, comentarios]
    );

    res.status(201).json({
      message: 'Entrenamiento registrado exitosamente',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error registrando entrenamiento:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener registros de entrenamiento
exports.obtenerRegistros = async (req, res) => {
  try {
    const { participante_id, fecha_inicio, fecha_fin } = req.query;

    let query = `
      SELECT 
        re.*,
        ep.nombre_ejercicio,
        ep.dia_semana,
        ep.series as series_plan,
        ep.repeticiones as repeticiones_plan
      FROM registros_entrenamiento re
      JOIN ejercicios_plan ep ON re.ejercicio_plan_id = ep.id
      WHERE re.participante_id = ?
    `;

    const params = [participante_id];

    if (fecha_inicio && fecha_fin) {
      query += ' AND re.fecha_registro BETWEEN ? AND ?';
      params.push(fecha_inicio, fecha_fin);
    }

    query += ' ORDER BY re.fecha_registro DESC, re.fecha_hora_registro DESC';

    const [registros] = await pool.query(query, params);

    res.json(registros);
  } catch (error) {
    console.error('Error obteniendo registros:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener historial de un ejercicio específico
exports.obtenerHistorialEjercicio = async (req, res) => {
  try {
    const { participante_id, ejercicio_plan_id } = req.params;

    const [registros] = await pool.query(
      `SELECT 
        re.*,
        ep.nombre_ejercicio,
        ep.dia_semana,
        ep.series as series_plan,
        ep.repeticiones as repeticiones_plan
      FROM registros_entrenamiento re
      JOIN ejercicios_plan ep ON re.ejercicio_plan_id = ep.id
      WHERE re.participante_id = ? AND re.ejercicio_plan_id = ?
      ORDER BY re.fecha_registro DESC, re.fecha_hora_registro DESC
      LIMIT 20`,
      [participante_id, ejercicio_plan_id]
    );

    res.json(registros);
  } catch (error) {
    console.error('Error obteniendo historial del ejercicio:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener último registro de un ejercicio
exports.obtenerUltimoRegistro = async (req, res) => {
  try {
    const { participante_id, ejercicio_plan_id } = req.params;

    const [registros] = await pool.query(
      `SELECT * FROM registros_entrenamiento
      WHERE participante_id = ? AND ejercicio_plan_id = ?
      ORDER BY fecha_registro DESC, fecha_hora_registro DESC
      LIMIT 1`,
      [participante_id, ejercicio_plan_id]
    );

    res.json(registros.length > 0 ? registros[0] : null);
  } catch (error) {
    console.error('Error obteniendo último registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar registro de entrenamiento
exports.actualizarRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const { peso_utilizado, series_completadas, repeticiones_completadas, comentarios } = req.body;

    const [result] = await pool.query(
      `UPDATE registros_entrenamiento 
       SET peso_utilizado = ?, series_completadas = ?, repeticiones_completadas = ?, comentarios = ?
       WHERE id = ?`,
      [peso_utilizado, series_completadas, repeticiones_completadas, comentarios, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    res.json({ message: 'Registro actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar registro de entrenamiento
exports.eliminarRegistro = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM registros_entrenamiento WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    res.json({ message: 'Registro eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

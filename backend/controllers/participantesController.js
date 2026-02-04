const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

// Obtener todos los participantes
exports.obtenerParticipantes = async (req, res) => {
  try {
    const [participantes] = await pool.query(`
      SELECT 
        p.*,
        COUNT(DISTINCT pe.id) as total_planes_entrenamiento,
        COUNT(DISTINCT pn.id) as total_planes_nutricion
      FROM participantes p
      LEFT JOIN planes_entrenamiento pe ON p.id = pe.participante_id
      LEFT JOIN planes_nutricion pn ON p.id = pn.participante_id
      WHERE p.activo = TRUE
      GROUP BY p.id
      ORDER BY p.fecha_registro DESC
    `);

    res.json(participantes);
  } catch (error) {
    console.error('Error obteniendo participantes:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener un participante por ID
exports.obtenerParticipante = async (req, res) => {
  try {
    const { id } = req.params;

    const [participantes] = await pool.query(
      'SELECT * FROM participantes WHERE id = ? AND activo = TRUE',
      [id]
    );

    if (participantes.length === 0) {
      return res.status(404).json({ error: 'Participante no encontrado' });
    }

    res.json(participantes[0]);
  } catch (error) {
    console.error('Error obteniendo participante:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Crear nuevo participante
exports.crearParticipante = async (req, res) => {
  try {
    const { nombre, email, password, telefono, fecha_nacimiento, genero } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO participantes 
       (nombre, email, password, telefono, fecha_nacimiento, genero, usuario_creador_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, email, hashedPassword, telefono, fecha_nacimiento, genero, req.user.id]
    );

    res.status(201).json({
      message: 'Participante creado exitosamente',
      id: result.insertId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    console.error('Error creando participante:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar participante
exports.actualizarParticipante = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, fecha_nacimiento, genero } = req.body;

    const [result] = await pool.query(
      `UPDATE participantes 
       SET nombre = ?, email = ?, telefono = ?, fecha_nacimiento = ?, genero = ?
       WHERE id = ? AND activo = TRUE`,
      [nombre, email, telefono, fecha_nacimiento, genero, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Participante no encontrado' });
    }

    res.json({ message: 'Participante actualizado exitosamente' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    console.error('Error actualizando participante:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar participante (soft delete)
exports.eliminarParticipante = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'UPDATE participantes SET activo = FALSE WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Participante no encontrado' });
    }

    res.json({ message: 'Participante eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando participante:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Cambiar contraseña del participante
exports.cambiarPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { nueva_password } = req.body;

    if (!nueva_password) {
      return res.status(400).json({ error: 'Nueva contraseña es requerida' });
    }

    const hashedPassword = await bcrypt.hash(nueva_password, 10);

    const [result] = await pool.query(
      'UPDATE participantes SET password = ? WHERE id = ? AND activo = TRUE',
      [hashedPassword, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Participante no encontrado' });
    }

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

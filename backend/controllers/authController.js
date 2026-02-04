const { pool } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login de Usuario (Entrenador/Admin)
exports.loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const [usuarios] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ? AND activo = TRUE',
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = usuarios[0];
    const validPassword = await bcrypt.compare(password, usuario.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol, tipo: 'usuario' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Login de Participante
exports.loginParticipante = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const [participantes] = await pool.query(
      'SELECT * FROM participantes WHERE email = ? AND activo = TRUE',
      [email]
    );

    if (participantes.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const participante = participantes[0];
    const validPassword = await bcrypt.compare(password, participante.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: participante.id, email: participante.email, rol: 'participante', tipo: 'participante' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      participante: {
        id: participante.id,
        nombre: participante.nombre,
        email: participante.email
      }
    });
  } catch (error) {
    console.error('Error en login participante:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Registro de nuevo usuario (solo admin)
exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, rol || 'entrenador']
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      id: result.insertId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    console.error('Error registrando usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Verificar token
exports.verificarToken = async (req, res) => {
  res.json({ 
    valid: true, 
    user: req.user 
  });
};

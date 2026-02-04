const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Rutas públicas
router.post('/login/usuario', authController.loginUsuario);
router.post('/login/participante', authController.loginParticipante);

// Rutas protegidas
router.post('/registrar-usuario', authenticateToken, isAdmin, authController.registrarUsuario);
router.get('/verificar', authenticateToken, authController.verificarToken);

module.exports = router;

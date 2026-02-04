const express = require('express');
const router = express.Router();
const participantesController = require('../controllers/participantesController');
const { authenticateToken, isTrainer } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas de participantes (solo entrenadores)
router.get('/', isTrainer, participantesController.obtenerParticipantes);
router.get('/:id', participantesController.obtenerParticipante);
router.post('/', isTrainer, participantesController.crearParticipante);
router.put('/:id', isTrainer, participantesController.actualizarParticipante);
router.delete('/:id', isTrainer, participantesController.eliminarParticipante);
router.patch('/:id/cambiar-password', isTrainer, participantesController.cambiarPassword);

module.exports = router;

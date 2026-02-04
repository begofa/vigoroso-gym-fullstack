const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const participantesRoutes = require('./routes/participantes');
const entrenamientoRoutes = require('./routes/entrenamiento');
const nutricionRoutes = require('./routes/nutricion');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/participantes', participantesRoutes);
app.use('/api/entrenamiento', entrenamientoRoutes);
app.use('/api/nutricion', nutricionRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Gimnasio VIGOROSO funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta por defecto
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Gimnasio VIGOROSO',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      participantes: '/api/participantes',
      entrenamiento: '/api/entrenamiento',
      nutricion: '/api/nutricion',
      health: '/api/health'
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
async function startServer() {
  try {
    // Probar conexión a la base de datos
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('No se pudo conectar a la base de datos. Verifica la configuración.');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log('╔════════════════════════════════════════╗');
      console.log('║     🏋️  GIMNASIO VIGOROSO API 🏋️         ║');
      console.log('╚════════════════════════════════════════╝');
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 API disponible en: http://localhost:${PORT}`);
      console.log('════════════════════════════════════════');
    });
  } catch (error) {
    console.error('Error iniciando el servidor:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;

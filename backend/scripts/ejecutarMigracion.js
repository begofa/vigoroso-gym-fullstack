const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function ejecutarMigracion() {
  let connection;

  try {
    console.log('🔧 Iniciando migración de base de datos...\n');

    // Conectar a MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'vigoroso_gym',
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });

    console.log('✅ Conectado a MySQL\n');

    // Leer el archivo SQL de migración
    const sqlFile = path.join(__dirname, 'migracion_prescripcion.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('📄 Ejecutando script de migración...\n');

    // Ejecutar las queries
    const [results] = await connection.query(sql);

    console.log('✅ Migración completada exitosamente\n');

    // Mostrar resultados
    console.log('📊 Cambios aplicados:');
    console.log('   ✓ Campo rutina_diaria agregado a planes_entrenamiento');
    console.log('   ✓ Campos mejorados en ejercicios_plan para soportar:');
    console.log('     - Superseries');
    console.log('     - Ejercicios con tiempo');
    console.log('     - Series/repeticiones variables');
    console.log('   ✓ Tabla de categorías de ejercicios creada');
    console.log('   ✓ Vista mejorada para planes completos');
    console.log('   ✓ Índices de optimización agregados\n');

    // Verificar categorías insertadas
    const [categorias] = await connection.query('SELECT COUNT(*) as total FROM categorias_ejercicios');
    console.log(`📁 Categorías de ejercicios disponibles: ${categorias[0].total}\n`);

    console.log('╔════════════════════════════════════════╗');
    console.log('║  ✅ Migración Completada               ║');
    console.log('╚════════════════════════════════════════╝\n');

    console.log('💡 Próximos pasos:');
    console.log('   1. Reiniciar el servidor backend (npm run dev)');
    console.log('   2. El sistema ahora soporta:');
    console.log('      - Rutinas diarias (cardio, movilidad, etc.)');
    console.log('      - Superseries y ejercicios combinados');
    console.log('      - Ejercicios con tiempo (planchas, etc.)');
    console.log('      - Formato flexible de series y repeticiones\n');

  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
    console.error('\nDetalles:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Ejecutar
if (require.main === module) {
  ejecutarMigracion()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error fatal:', error);
      process.exit(1);
    });
}

module.exports = ejecutarMigracion;

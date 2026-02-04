const { pool } = require('../config/database');
require('dotenv').config();

async function check() {
  const db = process.env.DB_NAME || 'vigoroso_gym';
  const connection = await pool.getConnection();
  try {
    console.log(`Checking columns in database: ${db}\n`);

    const [planesCols] = await connection.query(
      `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'planes_entrenamiento'`,
      [db]
    );

    const [ejerciciosCols] = await connection.query(
      `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'ejercicios_plan'`,
      [db]
    );

    console.log('planes_entrenamiento columns:');
    planesCols.forEach(c => console.log(` - ${c.COLUMN_NAME} (${c.COLUMN_TYPE}) nullable:${c.IS_NULLABLE} default:${c.COLUMN_DEFAULT}`));
    console.log('\n');

    console.log('ejercicios_plan columns:');
    ejerciciosCols.forEach(c => console.log(` - ${c.COLUMN_NAME} (${c.COLUMN_TYPE}) nullable:${c.IS_NULLABLE} default:${c.COLUMN_DEFAULT}`));

  } catch (err) {
    console.error('Error checking columns:', err.message);
  } finally {
    connection.release();
    process.exit(0);
  }
}

if (require.main === module) {
  check();
}

module.exports = check;

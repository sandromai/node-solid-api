import mariadb, { PoolConnection } from 'mariadb';

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

export async function createOrRefreshConnection(connection: PoolConnection | undefined): Promise<PoolConnection> {
  let newConnection = connection;

  if (connection) {
    try {
      await connection.ping();
    } catch {
      newConnection = await pool.getConnection();
    }
  } else {
    newConnection = await pool.getConnection();
  }

  if (!newConnection) {
    throw new Error('Unable to connect to the database!');
  }

  return newConnection;
}

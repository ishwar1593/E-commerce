import pg from "pg";

const { Pool } = pg;
const connectDB = async () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // default Postgres port
    database: process.env.DB_NAME,
  });

  try {
    await pool.connect();
  } catch (err) {
    console.error("Error connecting to the database:", err.stack);
    throw err;
  }
};

export default connectDB;

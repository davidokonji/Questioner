import dotenv from 'dotenv';

import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_CONNECTIONSTRING,
});

const droptables = async () => {
  const text = `
              DROP TABLE IF EXISTS users CASCADE;
              DROP TABLE IF EXISTS meetup CASCADE;
              DROP TABLE IF EXISTS question CASCADE;
              DROP TABLE IF EXISTS rsvp CASCADE;
              DROP TABLE IF EXISTS comments CASCADE;
              DROP TABLE IF EXISTS votes CASCADE;
            `;
  const query = await pool.query(text);
  return query;
};

droptables();

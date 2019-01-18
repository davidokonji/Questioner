import { Pool } from 'pg';

import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
// pool.on('connect', () => {
//   console.log('connected to db');
// });
// pool.on('remove', () => {
//   console.log('disconnected');
// });
export default {
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  end() {
    return pool.end();
  },
};

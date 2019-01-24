import { Pool } from 'pg';

import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_CONNECTIONSTRING,
});
export default {
  query(text, params) {
    return new Promise((resolve) => {
      pool.query(text, params)
        .then((res) => {
          resolve(res);
        });
    // .catch((err) => {
    //   return reject(err);
    // });
    });
  },
  // end() {
  //   return pool.end();
  // },
};

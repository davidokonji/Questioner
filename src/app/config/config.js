import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.DATABASE_URL = 'postgresql://okonjidavid@localhost:5432/questioner';
  process.env.SECRET_KEY = 'mysecretkey';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.DATABASE_URL = 'postgresql://okonjidavid@localhost:5432/questioner_test';
  process.env.SECRET_KEY = 'mysecretkey';
} else if (env === 'production') {
  process.env.POSTGRES_URI = '';
}
export default env;

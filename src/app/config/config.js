import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.DB_CONNECTIONSTRING = 'postgres://inixtdbj:GmzTVVENIh-UDGf2b8g5v8y7CWI2Yq4a@stampy.db.elephantsql.com:5432/inixtdbj';
  process.env.SECRET_KEY = 'mysecretkey';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.DB_CONNECTIONSTRING = 'postgres://inixtdbj:GmzTVVENIh-UDGf2b8g5v8y7CWI2Yq4a@stampy.db.elephantsql.com:5432/inixtdbj';
  process.env.SECRET_KEY = 'mysecretkey';
}
export default env;

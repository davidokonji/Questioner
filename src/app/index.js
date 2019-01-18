import 'babel-polyfill';

import dotenv from 'dotenv';

import app from './controller/routes';

dotenv.config();

const port = process.env.PORT || process.env.DEV_PORT;

app.listen(port);

export default app;

import 'babel-polyfill';

import dotenv from 'dotenv';

import app from './controller/routes';

dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port);

export default app;

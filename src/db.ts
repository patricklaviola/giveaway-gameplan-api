import { Pool } from 'pg';

import config from './config/config.js';

const pool = new Pool({
  user: config.db.user,
  password: config.db.password,
  host: config.db.host,
  database: config.db.name,
  port: config.db.port,
});

export default pool;

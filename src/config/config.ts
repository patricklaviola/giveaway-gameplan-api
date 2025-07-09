import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env variable: ${key}`);
  return value;
}

type Config = {
  port: number;
  nodeEnv: string;
  db: {
    user: string;
    password: string;
    host: string;
    port: number;
    name: string;
  };
};

const config: Config = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    user: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
    host: requireEnv('DB_HOST'),
    port: Number(requireEnv('DB_PORT')),
    name: requireEnv('DB_NAME'),
  },
};

export default config;

import { cleanEnv, str, port } from 'envalid';

const env = cleanEnv(process.env, {
  PORT: port({
    default: 5000,
  }),

  DATABASE_URL: str(),

  JWT_SECRET: str(),
});

export default env;
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  fmcsaApiUrl: process.env.FMCSA_API_URL || 'https://mobile.fmcsa.dot.gov/qc/services/carriers',
  fmcsaApiKey: process.env.FMCSA_API_KEY || '',
  databaseUrl: process.env.DATABASE_URL || '',
};

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  gcs: {
    bucketName: process.env.GCS_BUCKET_NAME || '',
    projectId: process.env.GCS_PROJECT_ID || '',
    keyFile: process.env.GCS_KEY_FILE || '',
    signedUrlExpiresIn: parseInt(process.env.SIGNED_URL_EXPIRES_IN || '300'),
  },
  
  payment: {
    kaspiApiKey: process.env.KASPI_API_KEY || '',
    payboxMerchantId: process.env.PAYBOX_MERCHANT_ID || '',
    payboxSecretKey: process.env.PAYBOX_SECRET_KEY || '',
  },
};




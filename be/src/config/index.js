import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'prod') {
  dotenv.config();
} else {
  dotenv.config({ path: '.env.prod' });
}

export default {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 8080,

  supabase: {
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_ANON_KEY || '',
  },
};
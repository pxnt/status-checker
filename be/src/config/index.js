import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
} else {
  dotenv.config({ path: '.env.production' });
}

export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080,

  supabase: {
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_ANON_KEY || '',
  },
};
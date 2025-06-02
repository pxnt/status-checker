import { createClient } from '@supabase/supabase-js'
import config from '../config/index.js'
import container from '../container.js'

async function bootResources() {
  // boot redis, db, etc

  const supabase = createClient(config.supabase.url, config.supabase.key)
  container.add('supabase', supabase)
}

export default bootResources;
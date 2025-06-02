import container from "../container.js";

export async function createIncident(payload) {
  const supabase = container.get('supabase')
  const { data, error } = await supabase
    .from('incidents')
    .insert(payload)
    .select();

  if (error) {
    throw new Error(error)
  }
  return data
}

export async function getIncidentById(incidentId) {
  const supabase = container.get('supabase')
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('id', incidentId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(error)
  }
  return data
}

export async function getIncidentsForOrg(orgId) {
  const supabase = container.get('supabase')
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('org_id', orgId)
    .order('occurred_at', { ascending: false });

  if (error) {
    throw new Error(error)
  }
  return data
}

export async function getIncidentsForUser(userId) {
  const supabase = container.get('supabase')
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('user_id', userId)
    .eq('org_id', null)
    .order('occurred_at', { ascending: false });

  if (error) {
    throw new Error(error)
  }
  return data
}

export async function getPublicIncidents({ start_date, end_date } = {}) {
  const supabase = container.get('supabase')
  let query = supabase
    .from('incidents')
    .select('*')
    .eq('visible', true)
    .order('occurred_at', { ascending: false });

  // Apply date filters if provided
  if (start_date) {
    query = query.gte('occurred_at', start_date);
  }
  if (end_date) {
    query = query.lte('occurred_at', end_date);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error)
  }
  return data
}

export async function updateIncident(incidentId, payload) {
  const supabase = container.get('supabase')
  
  // Remove undefined and null values from payload
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );

  const { data, error } = await supabase
    .from('incidents')
    .update(cleanPayload)
    .eq('id', incidentId)
    .select();

  if (error) {
    throw new Error(error)
  }
  return data
}

export async function deleteIncident(incidentId) {
  const supabase = container.get('supabase')
  const { data, error } = await supabase
    .from('incidents')
    .delete()
    .eq('id', incidentId)
    .select();

  if (error) {
    throw new Error(error)
  }
  return data
} 
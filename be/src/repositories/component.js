import container from "../container.js";

export async function createComponent(payload) {
  const supabase = container.get('supabase')
  const { data, error } = await supabase
    .from('components')
    .insert(payload)
    .select();

  if (error) {
    throw new Error(error)
  }
  return data
}

export async function getComponentsForComponentGroups(componentGroupIds) {
  const supabase = container.get('supabase')
  const { data, error } = await supabase
    .from('components')
    .select()
    .in('component_group_id', componentGroupIds)

  if (error) {
    throw new Error(error)
  }
  return data
}

export async function updateComponent(componentId, payload) {
  const supabase = container.get('supabase')
  
  // Remove undefined and null values from payload
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );

  const { data, error } = await supabase
    .from('components')
    .update(cleanPayload)
    .eq('id', componentId)
    .select();

  if (error) {
    throw new Error(error)
  }
  return data
}

export async function getComponentsByIds(componentIds) {
  const supabase = container.get('supabase')
  const { data, error } = await supabase
    .from('components')
    .select('*')
    .in('id', componentIds)
  
  if (error) {
    throw new Error(error)
  }
  return data;
}
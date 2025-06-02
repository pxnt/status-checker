import container from "../container.js";

export async function createComponentGroup(payload) {
  const supabase = container.get('supabase')
  const { data, error } = await supabase
    .from('component_groups')
    .insert(payload)
    .select();
  
  if (error) {
    throw new Error(error)
  }
  return data
}

export async function getComponentGroupsForOrg(orgId) {
  const supabase = container.get('supabase')

  const { data, error } = await supabase
    .from('component_groups')
    .select(`
    *,
    components (
      *
    )
  `)
    .eq('org_id', orgId)

  if (error) {
    throw new Error(error)
  }
  return data
}

export async function getComponentGroupsForUser(userId) {
  const supabase = container.get('supabase')
  const { data, error } = await supabase
    .from('component_groups')
    .select(`
      *,
      components (
        *
      )
    `)
    .eq('user_id', userId)
    .eq('org_id', null)


  if (error) {
    throw new Error(error)
  }
  return data
}

export async function updateComponentGroupForOrg(org_id, component_group_id, payload) {
  const supabase = container.get('supabase')

  // Remove undefined and null values from payload
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );

  const { data, error } = await supabase
    .from('component_groups')
    .update(cleanPayload)
    .eq('id', component_group_id)
    .eq('org_id', org_id)
    .select()

  if (error) {
    throw new Error(error)
  }
  return data
}

export async function updateComponentGroupForUser(user_id, component_group_id, payload) {
  const supabase = container.get('supabase')

  // Remove undefined and null values from payload
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );

  const { data, error } = await supabase
    .from('component_groups')
    .update(cleanPayload)
    .eq('id', component_group_id)
    .eq('user_id', user_id)
    .select()

  if (error) {
    throw new Error(error)
  }
  return data
}

export async function getPublicComponentGroups() {
  const supabase = container.get('supabase')

  const { data, error } = await supabase
    .from('component_groups')
    .select(`
      *,
      components (
        *
      )
    `)
    .eq('visible', true)
    .eq('components.visible', true)
  
  if (error) {
    throw new Error(error)
  }
  return data
}
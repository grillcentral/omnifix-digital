export function isAdmin(profile) {
  return profile?.ativo !== false && profile?.role === "admin";
}

export function canManageOS(profile) {
  return profile?.ativo !== false && ["admin", "tecnico", "atendente"].includes(profile?.role);
}

export function canManageStock(profile) {
  return profile?.ativo !== false && ["admin", "tecnico"].includes(profile?.role);
}

export function canManageLeads(profile) {
  return profile?.ativo !== false && ["admin", "atendente"].includes(profile?.role);
}

export function canAccessRoles(profile, roles = []) {
  return profile?.ativo !== false && roles.includes(profile?.role);
}

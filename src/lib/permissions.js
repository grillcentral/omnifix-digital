const VALID_ROLES = new Set(["admin", "tecnico", "atendente"]);

function hasActiveProfile(profile) {
  return Boolean(profile?.id && profile?.ativo !== false && VALID_ROLES.has(profile?.role));
}

export function isAdmin(profile) {
  return hasActiveProfile(profile) && profile.role === "admin";
}

export function canManageOS(profile) {
  return hasActiveProfile(profile) && ["admin", "tecnico", "atendente"].includes(profile.role);
}

export function canManageStock(profile) {
  return hasActiveProfile(profile) && ["admin", "tecnico"].includes(profile.role);
}

export function canManageLeads(profile) {
  return hasActiveProfile(profile) && ["admin", "atendente"].includes(profile.role);
}

export function canAccessRoles(profile, roles = []) {
  return hasActiveProfile(profile) && roles.includes(profile.role);
}

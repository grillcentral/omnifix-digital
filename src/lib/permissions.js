const VALID_ROLES = new Set(["admin", "tecnico", "atendente"]);

function hasActiveProfile(profile) {
  return Boolean(profile?.id && profile?.ativo !== false && VALID_ROLES.has(profile?.papel));
}

export function isAdmin(profile) {
  return hasActiveProfile(profile) && profile.papel === "admin";
}

export function canManageOS(profile) {
  return hasActiveProfile(profile) && ["admin", "tecnico", "atendente"].includes(profile.papel);
}

export function canManageStock(profile) {
  return hasActiveProfile(profile) && ["admin", "tecnico"].includes(profile.papel);
}

export function canManageLeads(profile) {
  return hasActiveProfile(profile) && ["admin", "atendente"].includes(profile.papel);
}

export function canAccessRoles(profile, roles = []) {
  return hasActiveProfile(profile) && roles.includes(profile.papel);
}

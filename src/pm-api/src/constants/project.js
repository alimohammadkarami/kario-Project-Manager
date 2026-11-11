export const PROJECT_ROLES = Object.freeze({
  OWNER: 'owner', // مدیر پروژه
  MEMBER: 'member', // عضو
});

export const PROJECT_ROLE_LABELS = Object.freeze({
  [PROJECT_ROLES.OWNER]: 'مدیر پروژه',
  [PROJECT_ROLES.MEMBER]: 'عضو',
});

export const MEMBER_STATUS = Object.freeze({
  ACTIVE: 'active',
  INVITED: 'invited',
});

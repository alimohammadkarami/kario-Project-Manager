/** The only place that decides which user fields leave the API. */
export const toPublicUser = (user) => ({
  id: user.id,
  fullName: user.full_name,
  email: user.email,
  avatarName: user.avatar_name,
  role: user.role,
  createdAt: user.created_at,
});

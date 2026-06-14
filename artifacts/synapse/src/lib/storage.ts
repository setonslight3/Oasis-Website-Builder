export interface UserData { name: string; email: string; }
export const getUser = (): UserData | null => {
  try { const u = localStorage.getItem('synapse_user'); return u ? JSON.parse(u) : null; } catch { return null; }
};
export const setUser = (user: UserData) => localStorage.setItem('synapse_user', JSON.stringify(user));
export const logout = () => localStorage.removeItem('synapse_user');
export const getRecentSearches = (): string[] => {
  try { const s = localStorage.getItem('synapse_recent_searches'); return s ? JSON.parse(s) : []; } catch { return []; }
};
export const addRecentSearch = (query: string) => {
  const searches = getRecentSearches().filter(s => s !== query);
  searches.unshift(query);
  localStorage.setItem('synapse_recent_searches', JSON.stringify(searches.slice(0, 8)));
};
export const getViewedExperiences = (): string[] => {
  try { const v = localStorage.getItem('synapse_viewed'); return v ? JSON.parse(v) : []; } catch { return []; }
};
export const addViewedExperience = (id: string) => {
  const viewed = getViewedExperiences().filter(v => v !== id);
  viewed.unshift(id);
  localStorage.setItem('synapse_viewed', JSON.stringify(viewed.slice(0, 6)));
};
export const getUserExperiences = (): any[] => {
  try { const e = localStorage.getItem('synapse_user_experiences'); return e ? JSON.parse(e) : []; } catch { return []; }
};
export const addUserExperience = (exp: any) => {
  const experiences = getUserExperiences();
  experiences.unshift(exp);
  localStorage.setItem('synapse_user_experiences', JSON.stringify(experiences));
};

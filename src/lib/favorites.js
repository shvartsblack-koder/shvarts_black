const KEY = 'schwarz_favorites';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch { return []; }
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}

export function toggleFavorite(id) {
  const list = getFavorites();
  const idx = list.indexOf(id);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(id);
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('favorites-changed'));
  return idx < 0;
}

export function clearFavorites() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event('favorites-changed'));
}
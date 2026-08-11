// Simple persistence layer for the standalone PWA build.
// Mirrors a get/set/delete shape so it's a drop-in swap for a real
// backend (e.g. Supabase/Firebase) later, once you want cross-device
// accounts instead of on-this-device storage.

const PREFIX = "curl-diary:";

export const storage = {
  async get(key) {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      if (raw === null) return null;
      return { key, value: raw };
    } catch (e) {
      throw e;
    }
  },
  async set(key, value) {
    try {
      window.localStorage.setItem(PREFIX + key, value);
      return { key, value };
    } catch (e) {
      throw e;
    }
  },
  async delete(key) {
    try {
      window.localStorage.removeItem(PREFIX + key);
      return { key, deleted: true };
    } catch (e) {
      throw e;
    }
  },
};

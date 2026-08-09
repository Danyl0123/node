const TTL_MS = 30 * 1000;

const store = new Map();

function get(key) {
  const entry = store.get(key);
  if (!entry) {
    return null;
  }

  if (Date.now() - entry.savedAt > TTL_MS) {
    store.delete(key);

    return null;
  }

  return entry.data;
}

function set(key, data) {
  store.set(key, { data, savedAt: Date.now() });
}

function clear() {
  store.clear();
}

module.exports = { get, set, clear, TTL_MS };

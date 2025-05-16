function setLocalStorageEntry(key, value) {
    localStorage.setItem(key, value);
}

function getLocalStorageEntry(key) {
    return localStorage.getItem(key) || null;
}

function clearLocalStorageEntry(key) {
    localStorage.removeItem(key);
}

export default {
    setLocalStorageEntry,
    getLocalStorageEntry,
    clearLocalStorageEntry,
};

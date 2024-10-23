const checkIfOnlyCertainKeys = (obj, keysName) => {
  const keys = Object.keys(obj);
  let hasError = false;
  if (keys.length !== keysName.length) {
    hasError = true;
    return hasError;
  }

  for (const key of keys) {
    if (!keysName.includes(key)) {
      hasError = true;
      break;
    }
  }
  return hasError;
};

module.exports = checkIfOnlyCertainKeys;

const checkEmptyInputs = (payload) => {
  const result = {
    hasEmptyInputs: false,
    emptyKey: null,
  };
  for (const key in payload) {
    if (
      payload[key] === "" ||
      payload[key] === undefined ||
      payload[key] === null
    ) {
      result.hasEmptyInputs = true;
      result.emptyKey = key;
      break;
    }
  }
  return result;
};

module.exports = checkEmptyInputs;

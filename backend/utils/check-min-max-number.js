const checkMinMaxNumber = (payload, minMaxValues) => {
  const result = {
    hasError: false,
    affectedKey: null,
  };
  if (minMaxValues.length && minMaxValues.length === 2) {
    for (const key in payload) {
      const min = minMaxValues[0];
      const max = minMaxValues[1];
      if (
        (min !== null &&
          max !== null &&
          (payload[key] < min || payload[key] > max)) ||
        (min === null && max !== null && payload[key] > max) ||
        (min !== null && max === null && payload[key] < min)
      ) {
        result.hasError = true;
        result.affectedKey = key;
        break;
      }
    }
  }

  return result;
};

module.exports = checkMinMaxNumber;

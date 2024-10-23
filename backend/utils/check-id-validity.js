const checkIdValidity = (id) => {
  return isNaN(id) || id === 0;
};

module.exports = checkIdValidity;
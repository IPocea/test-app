const getAffectedKeyName = (key) => {
  switch (key) {
    case "brand":
      return "marca";
    case "yearOfManufacture":
      return "anul fabricatiei";
    case "cylindricalCapacity":
      return "capacitatea cilindrica";
    case "taxFee":
      return "taxa de impozit";
    case "firstName":
      return "prenume";
    case "lastName":
      return "nume de familie";
    case "age":
      return "varsta";
    default:
      return key;
  }
};

module.exports = getAffectedKeyName;

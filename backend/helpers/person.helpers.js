const getPersonsQueryOptions = (Op, Car, query) => {
  const options = {
    where: {},
    include: [
      {
        model: Car,
        as: "cars",
        through: { attributes: [] },
      },
    ],
    order: [],
  };

  const andConditions = [];

  if (query.searchValue) {
    andConditions.push({
      [Op.or]: [
        { firstName: { [Op.iLike]: `%${query.searchValue}%` } },
        { lastName: { [Op.iLike]: `%${query.searchValue}%` } },
        { CNP: { [Op.iLike]: `%${query.searchValue}%` } },
      ],
    });
  }

  if (andConditions.length) {
    options.where = { [Op.and]: andConditions };
  }

  const sortDirection =
    query && query.sortDirection === "asc"
      ? "ASC"
      : query && query.sortDirection === "desc"
      ? "DESC"
      : null;

  if (query.sortBy && sortDirection) {
    options.order.push([query.sortBy, sortDirection]);
  } else {
    options.order.push(["createdAt", "DESC"]);
  }

  return options;
};

const getPersonsPagination = async (Op, model, Car, query) => {
  const pageIndex = parseInt(query?.pageIndex) || 0;
  const limit = parseInt(query?.pageSize) || 10;
  const offset = pageIndex * limit;

  const options = getPersonsQueryOptions(Op, Car, query);

  options.limit = limit;
  options.offset = offset;

  const { rows: data, count: totalItems } = await model.findAndCountAll(
    options
  );

  return {
    data,
    pageIndex,
    pageSize: limit,
    totalItems,
  };
};

const getCarsToAddAndToRemove = (initialPersonData, carIds) => {
  const currentCarIds = initialPersonData.cars.map((car) => car.id);
  const newCarIdsSet = new Set(carIds);
  const currentCarIdsSet = new Set(currentCarIds);
  const carsToAdd = carIds.filter((carId) => !currentCarIdsSet.has(carId));
  const carsToRemove = currentCarIds.filter(
    (carId) => !newCarIdsSet.has(carId)
  );
  return {
    carsToAdd,
    carsToRemove,
  };
};

const personHelpers = {
  getPersonsPagination,
  getCarsToAddAndToRemove,
};

module.exports = personHelpers;

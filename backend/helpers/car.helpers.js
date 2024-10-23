const getCarsQueryOptions = (Op, query) => {
  const options = {
    where: {},
    order: [],
  };

  const andConditions = [];

  if (query.searchValue) {
    andConditions.push({
      [Op.or]: [
        { brand: { [Op.iLike]: `%${query.searchValue}%` } },
        { model: { [Op.iLike]: `%${query.searchValue}%` } },
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

const getCarsPagination = async (Op, model, query) => {
  const pageIndex = parseInt(query?.pageIndex) || 0;
  const limit = parseInt(query?.pageSize) || 10;
  const offset = pageIndex * limit;

  const options = getCarsQueryOptions(Op, query);

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

const carHelpers = {
  getCarsPagination,
};

module.exports = carHelpers;

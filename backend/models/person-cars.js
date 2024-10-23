module.exports = (sequelize, DataTypes) => {
  const PersonCars = sequelize.define(
    "person_cars",
    {
      personId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "id_person",
      },
      carId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "id_car",
      },
    },
    {
      sequelize,
      modelName: "PersonCars",
      timestamps: false,
    }
  );
  return PersonCars;
};

module.exports = (sequelize, DataTypes) => {
  const Car = sequelize.define(
    "cars",
    {
      brand: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      model: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      yearOfManufacture: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "year_of_manufacture",
        validate: {
          min: { args: 1886, msg: "Anul fabricarii trebuie sa fie minim 1886" },
          max: { args: 9999, msg: "Anul fabricarii trebuie sa fie maxim 9999" },
        },
      },
      cylindricalCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "cylindrical_capacity",
        validate: {
          max: {
            args: 9999,
            msg: "Capacitatea cilindrica nu poate fi mai mare decat 9999",
          },
        },
      },
      taxFee: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "tax_fee",
        validate: {
          max: {
            args: 9999,
            msg: "Taxa de impozit nu poate fi mai mare decat 9999",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Car",
      timestamps: true,
    }
  );
  return Car;
};

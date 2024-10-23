module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define(
    "persons",
    {
      firstName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "first_name",
      },
      lastName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "last_name",
      },
      CNP: {
        type: DataTypes.STRING(13),
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [13, 13],
            msg: "CNP invalid",
          },
        },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: { args: 1, msg: "Varsta nu poate fi mai mica decat 1" },
          max: { args: 200, msg: "Varsta nu poate fi mai mare decat 200" },
        },
      },
    },
    {
      sequelize,
      modelName: "Person",
      timestamps: true,
    }
  );
  return Person;
};

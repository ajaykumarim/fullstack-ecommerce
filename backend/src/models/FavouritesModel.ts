
import { DataTypes, Model, Sequelize } from "sequelize";

const FavouritesModel = (sequelize: Sequelize) => {
  class Favourites extends Model {}

  Favourites.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "Favourites",
    }
  );

  return Favourites;
};

export { FavouritesModel };

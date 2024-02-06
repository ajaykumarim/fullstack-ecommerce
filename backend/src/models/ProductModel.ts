
import { DataTypes, Model, Sequelize } from "sequelize";

const ProductModel = (sequelize: Sequelize) => {
  class Product extends Model {}

  Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          price: {
            type: DataTypes.FLOAT,
            allowNull: false,
          },quantity:
          {
            type:DataTypes.INTEGER,
            allowNull:false
          },
          imagePath: {
            type: DataTypes.STRING,
            allowNull: true,
          },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};

export { ProductModel };

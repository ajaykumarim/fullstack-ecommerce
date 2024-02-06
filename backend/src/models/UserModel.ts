// UserModel.ts
import { DataTypes, Model, Sequelize } from "sequelize";

const UserModel = (sequelize: Sequelize) => {
  class User extends Model {}

  User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          user: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          pass: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
          }
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};

export { UserModel };

import { Sequelize } from "sequelize";
import { ProductModel } from "./ProductModel";
import { UserModel } from "./UserModel";
import { FavouritesModel } from "./FavouritesModel";



const sequelize = new Sequelize({
    dialect: "postgres",
    username: "olzcjdlz",
    password: "tfe7IH7Iv8QpBCp-p2OrKl6rGrTRJXgZ",
    database: "olzcjdlz",
    host: "arjuna.db.elephantsql.com",
    port: 5432,
  });


const Product = ProductModel(sequelize);
const User = UserModel(sequelize);
const Favourites = FavouritesModel(sequelize);

export { sequelize, Product, User, Favourites };
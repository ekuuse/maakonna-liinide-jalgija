import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import process from "process";
import { Dialect } from "sequelize";

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
//const config = require(__dirname + "/../config/config.json")[env];

interface DB {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  [key: string]: any;
}

const db: DB = {} as DB;

let sequelize: Sequelize;

sequelize = new Sequelize(
  "mklsys",
  "mklsys_user",
  "vocopocovoco",
  {
    host: "localhost",
    port: 3306,
    dialect: "mariadb",
    logging: false,
  }
);


fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".ts" // use ".ts" in TypeScript
    );
  })
  .forEach((file: string) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

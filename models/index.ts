import * as fs from "fs";
import * as path from "path";
import { Sequelize, DataTypes } from "sequelize";
import * as process from "process";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const configPath = path.join(__dirname, '../config/config.json');
const configJson = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const basename = path.basename((new URL(import.meta.url).pathname));
const env = process.env.NODE_ENV || "development";
const config = configJson[env];
const db: any = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

await fs.promises.readdir(__dirname).then(async (files) => {
  const filteredFiles = files.filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  });

  for (const file of filteredFiles) {
    const modelModule = await import(path.join(__dirname, file));
    const model = modelModule.default(sequelize, DataTypes);
    db[model.name] = model;
  }
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { db };

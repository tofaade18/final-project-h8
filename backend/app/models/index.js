const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.layanan = require("./layanan.js")(sequelize, Sequelize);
db.ulasan = require("./ulasan.js")(sequelize, Sequelize);
db.refreshToken = require("../models/refreshToken.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.layanan.hasMany(db.ulasan,{
  foreignKey: 'layanansId',
  as: 'ul'
});

db.ulasan.belongsTo(db.layanan,{
  foreignKey: 'layanansId',
  as: 'layanan'
});

db.user.hasMany(db.ulasan,{
  foreignKey: 'userId',
  as: 'us'
});

db.ulasan.belongsTo(db.user,{
  foreignKey: 'userId',
  as: 'user'
});



db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});

db.user.hasOne(db.refreshToken, {
  foreignKey: 'userId', targetKey: 'id'
});



db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
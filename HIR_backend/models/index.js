const {Sequelize} = require('sequelize');

const dbConfig=require('../config/database');

const sequelize=new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.pass,
    {
        host: dbConfig.host,
        dialect:dbConfig.dialect,
        port:dbConfig.port,
        logging:dbConfig.logging
    }
);

const User=require('./user.model')(sequelize);
const Advert=require('./advert.model')(sequelize);
const Country=require('./country.model')(sequelize);


module.exports = {sequelize, User, Advert, Country}
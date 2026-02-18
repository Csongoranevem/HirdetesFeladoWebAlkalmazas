const {Sequelize} = require('sequelize');

const dbConfig=require('../config/database');
const { Op } = require('sequelize');

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

const operatorMap = {
    eq: Op.eq,
    ne: Op.ne,
    gt: Op.gt,
    gte: Op.gte,
    lt: Op.lt,
    lte: Op.lte,
    like: Op.like,
    not: Op.not,
    between: Op.between,
    and: Op.and,
    or: Op.or
}

const User=require('./user.model')(sequelize);
const Advert=require('./advert.model')(sequelize);
const Country=require('./country.model')(sequelize);


module.exports = {sequelize, User, Advert, Country,operatorMap}
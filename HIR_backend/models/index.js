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

function loadModel(path) {
    const exported = require(path);
    if (typeof exported === 'function') {
        return exported(sequelize);
    }
    // Already a model (e.g. module.exports = Model after define/init)
    return exported;
}

const User=loadModel('./user.model');
const Advert=loadModel('./advert.model');
const City=loadModel('./city.model');
const Category=loadModel('./category.model');
const Payment=loadModel('./payment.model');
const Support=loadModel('./support.model');
const Condition=loadModel('./condition.model');
const Image=loadModel('./images.model');

// Associations
Advert.hasMany(Image, { foreignKey: 'advert_id', as: 'images' });
Image.belongsTo(Advert, { foreignKey: 'advert_id', as: 'advert' });

module.exports = {sequelize, User, Advert, City, Image, Payment, Support, Condition, Category, operatorMap}
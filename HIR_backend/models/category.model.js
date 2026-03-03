const {DataTypes} = require('sequelize');
const bcrypt=require('bcrypt');
const { Category } = require('.');

module.exports = (sequelize)=>{
    const Category=sequelize.define(
        'categories',
        {
            id:{
                type:DataTypes.UUID,
                primaryKey: true,
                defaultValue:DataTypes.UUIDV4
            },
            name:{
                type:DataTypes.STRING(50),
                allowNull:false
            }

        }

    );

    return Category;
}
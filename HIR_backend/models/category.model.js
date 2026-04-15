const {DataTypes} = require('sequelize');
const bcrypt=require('bcrypt');

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

    Category.associate = (models) => {
        Category.belongsTo(models.adverts, {
            foreignKey: 'advert_id',
            as: 'advert'
        });
    };

    return Category;
}
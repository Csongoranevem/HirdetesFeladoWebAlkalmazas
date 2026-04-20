const {DataTypes} = require('sequelize');
const bcrypt=require('bcrypt');

module.exports = (sequelize)=>{
    const Wishlist=sequelize.define('Wishlist',{
        id:{
            type:DataTypes.UUID,
            primaryKey: true,
            defaultValue:DataTypes.UUIDV4
        },
        userId:{
            type:DataTypes.STRING,
            allowNull:false
        },
        advertId:{
            type:DataTypes.STRING,
            allowNull:false
        }
    });
    Wishlist.associate = (models) => {
        Wishlist.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Wishlist.belongsTo(models.Advert, { foreignKey: 'advert_id', as: 'advert' });
    };

    return Wishlist;
}
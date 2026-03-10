const {DataTypes} = require('sequelize');
const bcrypt=require('bcrypt');

module.exports = (sequelize)=>{
    const Image=sequelize.define(
        'images',
        {
            id:{
                type:DataTypes.UUID,
                primaryKey: true,
                defaultValue:DataTypes.UUIDV4
            },
            advert_id:{
                type:DataTypes.UUID,
                allowNull:false
            },
            url:{
                type:DataTypes.STRING(255),
                allowNull:false
            },
            alt:{
                type:DataTypes.STRING(255),
                allowNull:false
            }

        }

    );

    return Image;
}
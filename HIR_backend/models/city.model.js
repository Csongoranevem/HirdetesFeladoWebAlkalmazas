const {DataTypes} = require('sequelize');
const bcrypt=require('bcrypt');

module.exports = (sequelize)=>{
    const City=sequelize.define(
        'cities',
        {
            id:{
                type:DataTypes.UUID,
                primaryKey: true,
                defaultValue:DataTypes.UUIDV4
            },
            name:{
                type:DataTypes.STRING(50),
                allowNull:false
            },
            code:{
                type:DataTypes.STRING(100),
                allowNull:false
            }

        },
    {
        timestamps:true
    }

    );

    return City;
}
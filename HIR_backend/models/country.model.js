const {DataTypes} = require('sequelize');
const bcrypt=require('bcrypt');

module.exports = (sequelize)=>{
    const Country=sequelize.define(
        'countries',
        {
            id:{
                type:DataTypes.UUID,
                primaryKey: true,
                defaultValue:DataTypes.UUIDV4
            },
            name:{
                type:DataTypes.STRING(30),
                allowNull:false
            },
            code:{
                type:DataTypes.STRING(5),
                allowNull:false
            }

        },
    {
        timestamps:true
    }

    );

    return Country;
}
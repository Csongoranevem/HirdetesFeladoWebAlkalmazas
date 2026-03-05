const {DataTypes} = require('sequelize');
const bcrypt=require('bcrypt');

module.exports = (sequelize)=>{
    const Support=sequelize.define(
        'support',
        {
            id:{
                type:DataTypes.UUID,
                primaryKey: true,
                defaultValue:DataTypes.UUIDV4
            },
            question:{
                type:DataTypes.STRING(100),
                allowNull:false
            },
            answer:{
                type:DataTypes.STRING(500),
                allowNull:false
            },
            topic:{
                type:DataTypes.STRING(50),
                allowNull:false
            }

        }

    );

    return Support;
}
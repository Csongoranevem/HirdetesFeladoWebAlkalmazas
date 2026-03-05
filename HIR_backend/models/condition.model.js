const {DataTypes} = require('sequelize');
const bcrypt=require('bcrypt');

module.exports = (sequelize)=>{
    const Condition=sequelize.define(
        'condition',
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

    return Condition;
}
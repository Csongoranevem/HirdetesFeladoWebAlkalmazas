const {DataTypes} = require('sequelize');
const bcrypt=require('bcrypt');

module.exports = (sequelize)=>{
    const User=sequelize.define(
        'users',
        {
            id:{
                type:DataTypes.UUID,
                primaryKey: true,
                defaultValue:DataTypes.UUIDV4
            },
            name: {
                type:DataTypes.STRING(100),
                allowNull:false
            },
            email: {
                type:DataTypes.STRING(100),
                allowNull:false
            },
            password: {
                type:DataTypes.STRING(64),
                allowNull:false
            },
            role: {
                type:DataTypes.STRING(20),
                allowNull:false,
                defaultValue:'user'
            },
            secret: {
                type:DataTypes.UUID,
                allowNull:false,
                defaultValue:DataTypes.UUIDV4
            },
            phone: {
                type:DataTypes.STRING(30),
                allowNull:true
            },
            address: {
                type:DataTypes.STRING(100),
                allowNull:true
            },
            description: {
                type:DataTypes.TEXT,
                allowNull:true
            },
            reg: {
                type:DataTypes.DATE,
                allowNull:false,
                defaultValue:DataTypes.NOW
            },
            last: {
                type:DataTypes.DATE,
                allowNull:true
            },
            status: {
                type:DataTypes.BOOLEAN,
                allowNull:false,
                defaultValue:true
            }
        },
    {
        timestamps:true,
        hooks:{
            beforeCreate : async (user)=>{
            user.password=await bcrypt.hash(user.password, 10);
        },
            beforeUpdate : async (user)=>{
              //  if(user.changed('password')){
                    user.password=await bcrypt.hash(user.password, 10);
                    //user.secret =DataTypes.UUIDV4;
              //  }
            
        }


        }
    }

    );

    return User;
}
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
                type:DataTypes.STRING(30),
                allowNull:false
            },
            email: {
                type:DataTypes.STRING(25),
                allowNull:false
            },
            backup_email: {
                type:DataTypes.STRING(25),
                allowNull:true
            }
            ,
            password: {
                type:DataTypes.STRING(64),
                allowNull:false
            },
            role_id: {
                type:DataTypes.TINYINT(4),
                allowNull:false,
                defaultValue:0
            },
            phone: {
                type:DataTypes.STRING(15),
                allowNull:false
            },
            address: {
                type:DataTypes.STRING(80),
                allowNull:false
            },
            status: {
                type:DataTypes.TINYINT(1),
                allowNull:false,
                defaultValue:0
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
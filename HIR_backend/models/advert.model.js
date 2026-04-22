const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    const Advert = sequelize.define(
        'adverts',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            user_id: {
                type: DataTypes.STRING(64),
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(120),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING(500),
                allowNull: true
            }
            ,
            price: {
                type: DataTypes.DOUBLE(),
                allowNull: false
            },
            city_id: {
                type: DataTypes.UUID,
                allowNull: false
            },
            product_id: {
                type: DataTypes.UUID,
                allowNull: false
            },
            payment_method: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            category_id: {
                type: DataTypes.UUID,
                allowNull: false
            }
            ,
            condition_id: {
                type: DataTypes.UUID,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING(15),
                allowNull: false
            },
            date_of_upload: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            timestamps: true
        },       

    );

    return Advert;
}
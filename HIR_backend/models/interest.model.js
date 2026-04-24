const {DataTypes} = require('sequelize');
module.exports = (sequelize) => {
  const Interest = sequelize.define('Interest', {
    id: {
      type: DataTypes.TINYINT,
      primaryKey: true,
      autoIncrement: true
    },
    ad_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'interests',
    timestamps: false
  });

  return Interest;
};

module.exports = (sequelize, DataTypes) => {
  const Condition = sequelize.define('Condition', {
    id: {
      type: DataTypes.TINYINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'conditions',
    timestamps: false
  });

  return Condition;
};

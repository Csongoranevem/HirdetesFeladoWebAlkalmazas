module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.TINYINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    condition_id: {
      type: DataTypes.TINYINT,
      allowNull: false
    }
  }, {
    tableName: 'products',
    timestamps: false
  });

  return Product;
};

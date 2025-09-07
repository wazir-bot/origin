const { DataTypes } = require("sequelize");
const sequelize = require("../db/conn");
const User = require("./userModel"); // relation with User

const Doctor = sequelize.define("Doctor", {
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  feesPerCunsultation: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
}, {
  timestamps: true,
});

// 🟢 Associations (Doctor belongs to a User)
Doctor.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Doctor, { foreignKey: "userId" });

module.exports = Doctor;

import { DataTypes } from "sequelize";
import db from "../../../../db/connection";
import Usuario from "../../../user/domain/models/User";

const Session = db.define(
  "Session",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fechaInicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fechaFin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  { paranoid: true }
);

Session.belongsTo(Usuario, {foreignKey: "user_id"});

export default Session;

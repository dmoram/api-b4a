import { DataType, DataTypes } from "sequelize";
import db from "../../../../db/connection";
import User from "../../../user/domain/models/User";
import FungiRecord from "./FungiRecord";

const RecordLikes = db.define(
    "RecordLikes",
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
      record_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }
  );
  
  // Se agrega la relación de pertenencia a User y Post
  RecordLikes.belongsTo(User, { foreignKey: 'user_id' });
  RecordLikes.belongsTo(FungiRecord, { foreignKey: 'record_id' });
  
  export default RecordLikes;
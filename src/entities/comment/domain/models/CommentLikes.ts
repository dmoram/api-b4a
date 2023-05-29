import { DataType, DataTypes } from "sequelize";
import db from "../../../../db/connection";
import User from "../../../user/domain/models/User";
import Comment from "./Comment";

const CommentLikes = db.define("CommentLikes", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Se agrega la relación de pertenencia a User y Post
CommentLikes.belongsTo(User, { foreignKey: "user_id" });
CommentLikes.belongsTo(Comment, { foreignKey: "comment_id" });

export default CommentLikes;

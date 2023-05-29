import { DataType, DataTypes } from "sequelize";
import db from "../../../../db/connection";
import User from "../../../user/domain/models/User";
import Post from "../../../post/domain/models/Post";

const Comment = db.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { paranoid: true }
);

Comment.belongsTo(User, { foreignKey: "author_id" });
Comment.belongsTo(Post, { foreignKey: "post_id" });

export default Comment;

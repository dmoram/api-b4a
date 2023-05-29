import { DataType, DataTypes } from "sequelize";
import db from "../../../../db/connection";
import User from "../../../user/domain/models/User";
import Post from "./Post";

const PostLikes = db.define(
    "PostLikes",
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
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }
  );
  
  // Se agrega la relación de pertenencia a User y Post
  PostLikes.belongsTo(User, { foreignKey: 'user_id' });
  PostLikes.belongsTo(Post, { foreignKey: 'post_id' });
  
  export default PostLikes;
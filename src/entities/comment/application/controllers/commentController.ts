import { Request, Response } from "express";
import Post from "../../../post/domain/models/Post";
import User from "../../../user/domain/models/User";
import Comment from "../../domain/models/Comment";
import CommentLikes from "../../domain/models/CommentLikes";

export const getComments = async (req: Request, res: Response) => {
  const { post_id } = req.params;
  try {
    const comments = await Comment.findAll({
      include: {
        model: User,
        attributes: ["username", "userType"],
      },
      where: { post_id: post_id },
    });
    res.json({
      comments,
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

export const createComment = async (req: Request, res: Response) => {
  const { content, post_id, author_id } = req.body;
  if (!content || !post_id || !author_id) {
    return res
      .status(400)
      .json({ msg: "El contenido y el autor son requeridos" });
  }

  try {
    const comment = await Comment.create({
      content,
      post_id,
      author_id,
      likes: 0,
    });

    // Find the corresponding Post
    const post = await Post.findByPk(post_id);

    // Update the comments count and save the Post
    if (post) {
      post.update({
        comments: post.getDataValue("comments") + 1,
      });
      await post.save();
    }

    res.json({
      comment,
      ok: true,
    });
  } catch (error) {
    console.log(error);
    const errorMessage = "Hubo un error al crear el comentario.";
    return res.status(500).json({ msg: errorMessage, error: error });
  }
};

export const updateLikes = async (req: Request, res: Response) => {
  const { comment_id, user_id, action } = req.body;
  if (!comment_id || !user_id || !action) {
    return res
      .status(400)
      .json({ msg: "El ID del comentario, usuario y acción son requeridos" });
  }
  try {
    const comment = await Comment.findByPk(comment_id);

    if (!comment) {
      return res.status(404).json({ msg: "El post no fue encontrado" });
    }

    // Verificar si el usuario ya ha dado like al post
    const commentLike = await CommentLikes.findOne({
      where: {
        user_id: user_id,
        comment_id: comment_id,
      },
    });
    if (action === "like") {
      if (commentLike) {
        return res
          .status(400)
          .json({ msg: "El usuario ya ha dado like a este post" });
      }

      const newCommentLike = await CommentLikes.create({
        user_id: user_id,
        comment_id: comment_id,
      });

      comment.update({
        likes: comment.getDataValue("likes") + 1,
      });

      await comment.save();
    } else if (action === "dislike") {
      if (!commentLike) {
        return res
          .status(400)
          .json({ msg: "El usuario no ha dado like a este post" });
      }

      // Eliminar la instancia de PostLikes correspondiente al usuario y al post
      await commentLike.destroy();
      comment.update({
        likes: comment.getDataValue("likes") - 1,
      });
    }

    res.json({
      comment,
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

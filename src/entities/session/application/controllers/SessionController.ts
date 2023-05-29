import { Request, Response } from "express";
import Post from "../../../post/domain/models/Post";
import User from "../../../user/domain/models/User";

export const createSession = async (req: Request, res: Response) => {
    const { content, author_id, likes } = req.body;
    let image: string | undefined;
  
  
    if (!content || !author_id) {
      return res
        .status(400)
        .json({ msg: "El contenido y el autor son requeridos" });
    }
  
    try {
      const post = await Post.create({
        content,
        image,
        author_id,
        likes: 0,
        comments: 0,
      });
  
      res.json({
        post,
        ok: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: error });
    }
  };




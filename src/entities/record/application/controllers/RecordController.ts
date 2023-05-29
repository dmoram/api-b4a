import { Request, Response } from "express";
import Comment from "../../../comment/domain/models/Comment";
import User from "../../../user/domain/models/User";
import multer from "multer";
import path from "path";
import FungiRecord from "../../domain/models/FungiRecord";
import RecordLikes from "../../domain/models/RecordLikes";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/records/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExt = file.originalname.split(".").pop(); // obtener la extensión del archivo
    cb(null, uniqueSuffix + "-" + file.originalname + "." + fileExt); // agregar la extensión al nombre de archivo
  },
});

const upload = multer({ storage: storage });

export const createRecord = async (req: Request, res: Response) => {
  const { author_id, description, location, latitude, longitude, altitude, fungiClass } =
    req.body;
  let image: string | undefined;

  // Si se envió una imagen, guárdala en la ruta especificada en la configuración del almacenamiento de multer
  if (req.file) {
    image = req.file.path;
  }

  if (!description || !author_id || !location) {
    return res
      .status(400)
      .json({ msg: "La descripción, el autor y la ubicación son requeridos" });
  }

  try {
    const record = await FungiRecord.create({
      description,
      author_id,
      location,
      image,
      latitude,
      longitude,
      altitude,
      fungiClass,
      likes: 0,
      comments: 0,
    });

    res.json({
      record,
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

export const getRecords = async (req: Request, res: Response) => {
  try {
    const records = await FungiRecord.findAll({
      include: {
        model: User,
        attributes: ["username", "userType", "id"],
      },
    });
    res.json({ records, ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al obtener los registros" });
  }
};

export const getRecordImage = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Busca el post que contenga la imagen solicitada
    const record = await FungiRecord.findOne({ where: { id } });

    if (!record) {
      return res.status(404).json({ msg: "El post no fue encontrado" });
    }

    // Devuelve la imagen en formato de archivo
    const imagePath = path.join(
      "../../../../../..",
      record.getDataValue("image")
    );
    console.log(imagePath);
    res.sendFile(record.getDataValue("image"), { root: "." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

export const updateLikes = async (req: Request, res: Response) => {
  const { record_id, user_id, action } = req.body;
  if (!record_id || !user_id || !action) {
    return res
      .status(400)
      .json({ msg: "El ID del registro y usuario son requeridos" });
  }
  try {
    const record = await FungiRecord.findByPk(record_id);

    if (!record) {
      return res.status(404).json({ msg: "El post no fue encontrado" });
    }

    // Verificar si el usuario ya ha dado like al post
    const recordLike = await RecordLikes.findOne({
      where: {
        user_id: user_id,
        record_id: record_id,
      },
    });
    if (action === "like") {
      if (recordLike) {
        return res
          .status(400)
          .json({ msg: "El usuario ya ha dado like a este post" });
      }

      const newRecordLike = await RecordLikes.create({
        user_id: user_id,
        record_id: record_id,
      });

      record.update({
        likes: record.getDataValue("likes") + 1,
      });

      await record.save();
    } else if (action === "dislike") {
      if (!recordLike) {
        return res
          .status(400)
          .json({ msg: "El usuario no ha dado like a este post" });
      }

      // Eliminar la instancia de PostLikes correspondiente al usuario y al post
      await recordLike.destroy();
      record.update({
        likes: record.getDataValue("likes") - 1,
      });
    }

    res.json({
      record,
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

export const getRecordCount = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  try {
    // Busca el usuario correspondiente al user_id
    const user = await User.findOne({ where: { id: user_id } });

    if (!user) {
      return res.status(404).json({ msg: "El usuario no fue encontrado" });
    }

    // Busca los posts asociados al usuario
    const records = await FungiRecord.findAll({ where: { author_id: user_id } });

    // Obtiene la cantidad de posts
    const recordCount = records.length;

    res.json({
      user_id,
      recordCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  const { record_id } = req.params;

  try {
    // Busca el registro por su ID
    const record = await FungiRecord.findByPk(record_id);

    if (!record) {
      return res.status(404).json({ msg: "El registro no fue encontrado" });
    }

    // Elimina los registros de RecordLikes asociados al post
    await RecordLikes.destroy({ where: { record_id} });

    // Elimina el registro
    await record.destroy();

    res.json({ msg: "El registro ha sido eliminado exitosamente" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

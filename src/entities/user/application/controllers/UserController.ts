import { Request, Response } from "express";
import Usuario from "../../domain/models/User";
import Session from "../../../session/domain/models/Session";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const getUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const usuario = await Usuario.findByPk(id);

  if (usuario) {
    res.json(usuario);
  } else {
    res.status(404).json({
      msg: `no existe un usuario con el id ${id}`,
    });
  }
};

export const postUsuario = async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const emailExist = await Usuario.findOne({
      where: {
        email: body.email,
      },
    });

    if (emailExist) {
      return res.status(400).json({
        msg: `The email ${body.email} exists in bd`,
        ok: false,
      });
    }

    const usuario = Usuario.build(body);

    const salt = bcrypt.genSaltSync();
    usuario.set({ password: bcrypt.hashSync(body.password, salt) });
    await usuario.save();

    res.json({
      usuario,
      ok: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

export const loginUsuario = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({
      where: {
        email: email,
      },
    });

    if (!usuario || usuario.getDataValue("deletedAt") != null) {
      return res.status(404).json({
        msg: `El usuario con correo: ${email} no existe`,
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      usuario.getDataValue("password")
    );

    if (!isMatch) {
      return res.status(400).json({
        msg: "Credenciales inválidas",
      });
    }

    const user_id = usuario.getDataValue("id");

    // Buscar si hay una sesión activa para el usuario
    const activeSession = await Session.findOne({
      where: {
        user_id,
        active: true,
      },
    });

    let token;
    if (activeSession) {
      // Si hay una sesión activa, actualizar la sesión existente
      token = jwt.sign(
        { usuario: { id: user_id } },
        process.env.JWT_SECRET || "",
        { expiresIn: "14d" }
      );

      await activeSession.update({
        token,
        fechaInicio: new Date(),
      });
    } else {
      // Si no hay una sesión activa, crear una nueva sesión
      token = jwt.sign(
        { usuario: { id: user_id } },
        process.env.JWT_SECRET || "",
        { expiresIn: "14d" }
      );

      await Session.create({
        user_id,
        token,
        fechaInicio: new Date(),
        active: true,
      });
    }

    res.status(200).json({ id: user_id, token, mod: usuario.getDataValue("moderator") });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

export const logoutUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Buscar la sesión activa del usuario y desactivarla
    const activeSession = await Session.findOne({
      where: {
        user_id: id,
        active: true,
      },
    });

    if (!activeSession) {
      return res.status(404).json({
        msg: "No se encontró una sesión activa para el usuario",
      });
    }

    await activeSession.update({
      fechaFin: new Date(),
      active: false,
    });

    res.json({
      msg: "Sesión cerrada correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};



export const putUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        msg: `The user with id: ${id} not exists`,
      });
    }

    if (body.password) {
      const salt = bcrypt.genSaltSync();
      body.password = bcrypt.hashSync(body.password, salt);
    }

    if (body.email) {
      const emailExist = await Usuario.findOne({
        where: {
          email: body.email,
        },
      });

      if (emailExist) {
        return res.status(400).json({
          msg: `The email ${body.email} exists in bd`,
          ok: false,
        });
      }
    }

    await usuario.update(body);

    res.json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

export const deleteUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const usuario = await Usuario.findByPk(id);
  console.log("ga");

  if (!usuario) {
    return res.status(404).json({
      msg: `The user with id: ${id} not exists`,
    });
  }

  try {
    await usuario.destroy();

    res.json({
      msg: "usuario eliminado",
      id,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

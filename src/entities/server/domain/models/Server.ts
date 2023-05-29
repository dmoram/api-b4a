import express, { Application } from "express";
import userRoutes from "../../../user/infrastructure/web/routes/userRoutes";
import postRoutes from "../../../post/infrastructure/routes/postRoutes";
import commentRoutes from "../../../comment/infrastructure/routes/commentRoutes";
import SessionRoutes from "../../../session/infrastructure/routes/SessionRoutes";
import RecordRoutes from "../../../record/infrastructure/routes/RecordRoutes";
import cors from "cors";
import db from "../../../../db/connection";

class Server {
  private app: Application;
  private port: number;
  private apiPaths = {
    usuarios: "/api/usuarios",
    posts: "/api/posts",
    comments: "/api/comments",
    sessions: "/api/sessions",
    records: "/api/records",
  };

  constructor() {
    this.app = express();
    this.port = 8000;

    this.dbConnection();
    this.middlewares();
    this.routes();
  }

  async dbConnection() {
    try {
      await db.sync();
      console.log("DB Online");
    } catch (error: any) {
      throw new Error(error);
    }
  }
  // Functions  that are executed before the other routes
  middlewares() {
    // Cors
    this.app.use(cors());

    // Lectura del body
    this.app.use(express.json());

    // Carpeta pública
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.apiPaths.usuarios, userRoutes);
    this.app.use(this.apiPaths.posts, postRoutes);
    this.app.use(this.apiPaths.comments, commentRoutes);
    this.app.use(this.apiPaths.sessions, SessionRoutes);
    this.app.use(this.apiPaths.records, RecordRoutes);
  }

  listen() {
    this.app.listen(this.port, "0.0.0.0", () => {
      console.log("Servidor corriendo en puerto " + this.port);
    });
  }
}

export default Server;

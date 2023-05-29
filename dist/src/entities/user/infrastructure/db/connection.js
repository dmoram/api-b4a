"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db = new sequelize_1.Sequelize(process.env.NAMEDB || "testing", process.env.USERDB || "root", process.env.PASSWORD || "", {
    host: process.env.HOSTDB,
    dialect: "mysql",
    port: Number(process.env.PORTDB) || 3306,
    /*
    // quitar los mensajes de la bd que se muestran en la consola
    logging: false,
    */
});
exports.default = db;
//# sourceMappingURL=connection.js.map
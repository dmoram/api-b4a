"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("../../../user/infrastructure/web/routes/userRoutes"));
const seed_1 = __importDefault(require("../../../user/infrastructure/web/routes/seed"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = __importDefault(require("../../../user/infrastructure/db/connection"));
class Server {
    constructor() {
        this.apiPaths = {
            usuarios: "/api/usuarios",
            seed: "/seed",
        };
        this.app = (0, express_1.default)();
        this.port = 8000;
        this.dbConnection();
        this.middlewares();
        this.routes();
    }
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.sync();
                console.log("DB Online");
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    // Functions  that are executed before the other routes
    middlewares() {
        // Cors
        this.app.use((0, cors_1.default)());
        // Lectura del body
        this.app.use(express_1.default.json());
        // Carpeta pública
        this.app.use(express_1.default.static("public"));
    }
    routes() {
        this.app.use(this.apiPaths.usuarios, userRoutes_1.default);
        this.app.use(this.apiPaths.seed, seed_1.default);
    }
    listen() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log("Servidor corriendo en puerto " + this.port);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map
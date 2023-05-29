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
exports.loadData = void 0;
const data_1 = require("../../../user/infrastructure/db/data");
const User_1 = __importDefault(require("../../domain/models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const loadData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // limpiar bd
        yield User_1.default.destroy({ where: {}, force: true });
        // cargar datos
        const users = data_1.data.map((user) => {
            const salt = bcryptjs_1.default.genSaltSync();
            user.password = bcryptjs_1.default.hashSync(user.password, salt);
            return user;
        });
        // Encriptar
        yield User_1.default.bulkCreate(users);
        res.json({
            msg: "cargado correctamente",
            ok: true,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.loadData = loadData;
//# sourceMappingURL=seed.js.map
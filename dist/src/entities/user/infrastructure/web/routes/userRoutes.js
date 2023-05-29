"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../../../application/controllers/UserController");
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middlewares/validar-campos");
const router = (0, express_1.Router)();
router.get("/", UserController_1.getUsuarios);
router.get("/:id", UserController_1.getUsuario);
router.post("/", [
    (0, express_validator_1.check)("name", "It has to be string and also be greater than 2 characters")
        .not()
        .isEmpty()
        .isLength({ min: 2 }),
    (0, express_validator_1.check)("email", "invalid email").isEmail(),
    (0, express_validator_1.check)("password", "It has to be greater than 6 characters ")
        .notEmpty()
        .isLength({ min: 6 }),
    validar_campos_1.validarCampos,
], UserController_1.postUsuario);
router.put("/:id", UserController_1.putUsuario);
router.delete("/:id", UserController_1.deleteUsuario);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map
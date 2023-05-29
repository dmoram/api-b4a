"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seed_1 = require("../../../application/controllers/seed");
const router = (0, express_1.Router)();
router.get("/", seed_1.loadData);
exports.default = router;
//# sourceMappingURL=seed.js.map
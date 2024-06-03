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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const argon2_1 = __importDefault(require("argon2"));
const prisma = new client_1.PrismaClient();
const mySecret = process.env.MY_SECRET;
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield argon2_1.default.hash(password);
        return hash;
    });
}
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = yield hashPassword(req.body.password);
    const { email, name } = req.body;
    try {
        // Check if email already exists
        const existingUser = yield prisma.user.findUnique({
            where: {
                email,
                password,
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const newUser = yield prisma.user.create({
            data: {
                email,
                name,
                password,
            },
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, mySecret);
        return res.status(201).json({ token, message: "User created!!!" });
    }
    catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: error });
    }
});
exports.default = register;

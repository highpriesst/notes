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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mySecret = process.env.MY_SECRET;
const getUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return { userId: 123, password: "123457", username };
});
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //get the information from payload
    const { username, password } = req.body;
    //checking from the DB
    const user = yield getUser(username);
    //if not matching send error
    if (user.password !== password) {
        return res.status(403).json({
            error: "passowrds not matching",
        });
    }
    //@ts-ignore
    delete user.password;
    const token = jsonwebtoken_1.default.sign(user, mySecret, { expiresIn: "1H" });
    res.cookie("token", token, {
        httpOnly: true,
    });
    res.redirect("/welcome");
});

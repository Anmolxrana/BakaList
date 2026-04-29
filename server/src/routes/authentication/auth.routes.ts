import { IRouter } from "express";
import { login, logout, register } from "../../controllers/auth.controller";

export default (router: IRouter) => {
    router.post("/api/auth/register", register);
    router.post("/api/auth/login", login);
    router.post("/api/auth/logout", logout);
}
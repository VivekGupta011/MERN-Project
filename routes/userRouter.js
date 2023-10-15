const express = require("express");
const { signup, signin,getAllUser,getUser} = require("../Controllers/userController");
const {authMiddleware,isAdmin} =require("../middlewares/authMiddleWare");
const userRouter = express.Router();

userRouter.post("/signup",signup)

userRouter.post("/signin",signin)
// userRouter.get("/:id", authMiddleware, isAdmin, getUser);
userRouter.get("/all-user", getAllUser);
module.exports = userRouter;
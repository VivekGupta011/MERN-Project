const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require("../utils/validateMongodbId");
const SECRET_KEY = process.env.SECRET_KEY;

const signup = async (req, res) => {
    // Existing user Check
    // Hashed Password
    // User Creation
    // Token Generate


//register 
    const { firstname, lastname, mobile, email, password } = req.body;
    try {
        // Existing user Check
        const ExistingUser = await userModel.findOne({ email: email });
        if (ExistingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }
        console.log("ExistUser:");
        console.log(ExistingUser);
        // Hashed Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // User Creation 
        const result = await userModel.create({
            email: email,
            password: hashedPassword,
            firstname: firstname,
            lastname: lastname,
            mobile: mobile
        });

        // Token Generate
        // jwt method sign()
        const token = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY);
        res.status(201).json({ user: result, token: token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" })
    }
}

//Update A User
const UpdateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    const { firstname, lastname, email, mobile } = req.body;
    try {
        const findUpdateUser = await User.findByIdAndUpdate(
            _id,
            {
                firstname: firstname,
                lastname: lastname,
                email: email,
                mobile: mobile,
            },
            {
                new: true,
            }
        );
        return res.json(findUpdateUser);
    } catch (error) {
        throw new Error(error);
    }
});


//login
const signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
        // Existing user Check
        const ExistingUser = await userModel.findOne({ email: email });
        console.log("ExistingUser::")
        console.log(ExistingUser);
        if (!ExistingUser) {
            return res.status(404).json({ message: "User does not exists!" });
        }
        const matchPassword = await bcrypt.compare(password, ExistingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const token = jwt.sign({ email: ExistingUser.email, id: ExistingUser._id }, SECRET_KEY);
        res.status(201).json({ user: ExistingUser, token: token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" })
    }
})


//Get All User
const getAllUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await userModel.find();
        return res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
});

//Get A User
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const findUser = await userModel.findById(id);
    try {
        return res.json(findUser);
    } catch (error) {
        throw new Error("User Not Found");
    }
});


//Logout User
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await userModel.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate(
        { refreshToken },
        {
            refreshToken: "",
        }
    );
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);
});


//Delete A User
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const findDeleteUser = await userModel.findByIdAndDelete(id);
        return res.json(findDeleteUser);
    } catch (error) {
        throw new Error(error);
    }
});

//Blcok User
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const block = await userModel.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
        res.json({
            message: "User Blocked",
        });
    } catch (error) {
        throw new Error(error);
    }
});

//Unblock User
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const unBlock = await userModel.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
        res.json({
            message: "User Unblocked",
        });
    } catch (error) { }
});
module.exports = { signup, signin, getAllUser, getUser };
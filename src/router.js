const mongoose = require("mongoose");
const express = require("express");
const { User } = require("../src/module/model");
const { secretKey } = require("../config");
const bcrypt = require("bcrypt");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const jwt = require("jsonwebtoken");
const {authincate } = require("./authmiddleware");

router.post("/added", async (req, res) => {
    try {
        const newdata = {
            userName: req.body.userName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            class: req.body.class,
            date: req.body.date
        };
        console.log("newdata-------------------->>", newdata);
        const existingUser = await User.findOne({ email: req.body.email });
        console.log("existingUser-------------->>", existingUser);
        if (existingUser) throw "email allready register";
        const data = new User(newdata);
        console.log("data-------------->>", data);
        const savedata = await data.save();
        if (!savedata) throw "data is not save";

        return res.status(200).json({
            msg: "savedata sucessfully",
            result: savedata
        });
    } catch (error) {
        console.log("error--------------->>", error);
        res.status(500).json({
            msg: "internal server error",
            error: Error.message
        });
    };
});
router.post("/register", async (req, res) => {
    try {
        const newdata = {
            userName: req.body.userName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            class: req.body.class,
            date: req.body.date
        };
        console.log("newdata-------------------->>", newdata);
        const existingUser = await User.findOne({ email: req.body.email });
        console.log("existingUser--------------->>", existingUser);
        if (existingUser) {
            return res.status(401).json({
                msg: "email allready register"
            });
        };
        const saltRounds = 19;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        newdata.password = hashedPassword;

        const userdata = new User(newdata);
        const savedata = await userdata.save();

        return res.status(200).json({
            msg: "register data sucessfully",
            result: savedata
        });
    } catch (error) {
        console.log("error----------------->>", error);
        res.status(500).json({
            msg: "internal server error",
            error: Error.message
        });
    };
});
router.post("/register1", upload.single("Avatar"), async (req, res) => {
    try {
        const newdata = {
            userName: req.body.userName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            class: req.body.class,
            date: req.body.date
        };
        console.log("newdata------------------->>", newdata);
        const existingUser = await User.findOne({ email: req.body.email });
        console.log("existingUser------------", existingUser);
        if (existingUser) {
            return res.status(401).json({
                msg: "email allready register"
            });
        };
        const saltRounds = 15;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        newdata.password = hashedPassword;

        const data1 = new User(newdata);
        const savedata = await data1.save();

        return res.status(200).json({
            msg: "register data sucessfully",
            result: savedata
        });
    } catch (error) {
        console.log("error-------------------->>", error);
        res.status(500).json({
            msg: "internal server error",
            error: Error.message
        });
    };
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email: req.body.email });
        console.log("existingUser-------------->>", existingUser);
        if (!existingUser) {
            return res.status(401).json({
                msg: "invalited email find"
            });
        };
        const isPasswordMath = await bcrypt.compare(password, existingUser.password);
        console.log("isPasswordMath------------->>", isPasswordMath);
        if (!isPasswordMath) {
            return res.status(401).json({
                msg: "invalited password find"
            });
        };
        const token = jwt.sign({ id: existingUser._id.toString() }, secretKey);

        return res.status(200).json({
            msg: "login sucess",
            user: existingUser,
            token
        });
    } catch (error) {
        console.log("error---------------------->>", error);
        res.status(500).json({
            msg: "internal server error",
            error: Error.message
        });
    };
});
router.get("/getByToken", authincate, async (req, res) => {
    try {
        const UserId = req.user.id;
        console.log("UserId------------------->>", UserId);
        const getdata = await User.findOne({ _id: UserId });
        console.log("getdata------------->>", getdata);
        if (!getdata) {
            return res.status(401).json({
                msg: "invalited data find"
            });
        };
        return res.status(200).json({
            msg: "okk sucessfully data",
            result: getdata
        });
    } catch (error) {
        console.log("error---------------------->>", error);
        res.status(500).json({
            msg: "internal server error",
            error: Error.message
        });
    };
});
router.put("/updateByToken", authincate, async (req, res) => {
    try {
        const UserId = req.user.id;
        console.log("UserId------------------->>", UserId);
        const nodedata = {
            userName: req.body.userName,
            lastName: req.body.lastName,
            class: req.body.class,
            date: req.body.date
        };
        console.log("nodedata------------------->>", nodedata);
        const updatedata = await User.findByIdAndUpdate(UserId, { $set: nodedata }, { new: true });
        console.log("updatedata------------->>", updatedata);
        if (!updatedata) {
            return res.status(200).json({
                msg: "invalited data find"
            });
        };
        return res.status(200).json({
            msg: "updatedata sucessfully",
            result: updatedata
        });
    } catch (error) {
        console.log("error------------------->>", error);
        res.status(500).json({
            msg: "internal server error",
            error: Error.message
        });
    };
});
router.delete("/deleteByToken", authincate, async (req, res) => {
    try {
        const UserId = req.user.id;
        console.log("UserId------------------>>", UserId);
        const deletedata = await User.findByIdAndDelete(UserId);
        console.log("deletedata------------>>", deletedata);
        if (!deletedata) {
            return res.status(401).json({
                msg: "invalited data find"
            });
        };
        return res.status(200).json({
            msg: "deletedata sucessfully",
            result: deletedata
        });
    } catch (error) {
        console.log("error----------------------->>", error);
        res.status(500).json({
            msg: "internal server error",
            error: Error.message
        });
    };
});
router.put("/reset-password", async (req, res) => {
    try {
        const { email, oldPassword, newPassword, confirmPassword } = req.body;
        if (!email || !oldPassword || !newPassword || !confirmPassword) {
            return res.status(401).json({
                msg: "incompaleted password"
            });
        };
        const user = await User.findOne({ email });
        console.log("user------------------>>", user);
        if (!user) {
            return res.status(400).json({
                msg: "user data not find"
            });
        };
        const isPasswordMath = await bcrypt.compare(oldPassword, user.password);
        console.log("isPasswordMath----------------->>", isPasswordMath);
        if (!isPasswordMath) {
            return res.status(401).json({
                msg: "password wrong find"
            });
        };
        if (newPassword !== confirmPassword) {
            return res.status(403).json({
                msg: "miss mach password"
            });
        };
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({
            msg: "reset-password sucessfully",
            result: user
        });
    } catch (error) {
        console.log("error--------------------->>", error);
        res.status(500).json({
            msg: "internal server error",
            error: Error.message
        });
    };
});
router.get("/getdata", async (req, res) => {
    try {
        const response = await User.find();
        console.log("response----------------->>", response);
        if (!response) {
            return res.status(401).json({
                msg: "invalited data find"
            });
        };
        return res.status(200).json({
            msg: "okk sucessfully",
            count: response.length,
            result: response
        });
    } catch (error) {
        console.log("error------------------->>", error);
        res.status(500).json({
            msg: "internal server error",
            error: Error.message
        });
    };
});
router.get("/getById/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log("id----------------->>", id);
        const getdata = await User.findById(id);
        console.log("getdata-------------->>", getdata);
        if (!getdata) {
            return res.status(401).json({
                msg: "invalited data find"
            });
        };
        return res.status(200).json({
            msg: "getdata sucessfully",
            result: getdata
        });
    } catch (error) {
        console.log("error------------------------>>", error);
        res.status(500).json({
            msg: "internal server error",
            error: Error.message
        });
    };
});
router.put("/updateById/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log("id----------------->>", id);
        const helodata = {
            userName: req.body.userName,
            lastName: req.body.lastName,
            class: req.body.class,
            date: req.body.date
        };
        console.log("helodata------------>>", helodata);
        const updatedata = await User.findByIdAndUpdate(id, { $set: helodata }, { new: true });
        console.log("updatedata------------>>", updatedata);
        if (!updatedata) {
            return res.status(401).json({
                msg: "invalited data find"
            });
        };
        return res.status(200).json({
            msg: "updatedata sucessfully",
            result: updatedata
        });
    } catch (error) {
        console.log("error-------------------->>", error);
        res.status(500).json({
            msg: "internal server error",
            error: Error.message
        });
    };
});
router.delete("/deleteById/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log("id------------------>>", id);
        const deletedata = await User.findByIdAndDelete(id);
        console.log("deletedata----------->>", deletedata);
        if (!deletedata) {
            return res.status(401).json({
                msg: "invalited data find"
            });
        };
        return res.status(200).json({
            msg: "deletedata sucessfully",
            result: deletedata
        });
    } catch (error) {
        console.log("error----------------------->>", error);
        res.status(500).json({
            msg: "internal server error",
            error: Error.message
        });
    };
});
router.post("/searchWithEmail", async (req, res) => {
    try {
        const searchdata = await User.findOne({ email: req.body.email });
        console.log("searchdata---------------->>", searchdata);
        if (!searchdata) {
            return res.status(401).json({
                msg: "invalited data find"
            });
        };
        return res.status(200).json({
            msg: "okk sucessfully data",
            result: searchdata
        });
    } catch (error) {
        console.log("error---------------->>", error);
        res.status(500).json({
            msg: "internal server error",
            error: Error.message
        });
    };
});
router.post("/searchWithname", async (req, res) => {
    try {
        const searchdata = await User.findOne({ userName: req.body.userName });
        console.log("searchdata-------------->>", searchdata);
        if (!searchdata) {
            return res.status(401).json({
                msg: "invalited data find"
            });
        };
        return res.status(200).json({
            msg: "okk sucessfully data",
            result: searchdata
        });
    } catch (error) {
        console.log("error------------------>>", error);
        res.status(500).json({
            msg: "internal server error",
            error: Error.message
        });
    };
});
router.post("/searchWithuserName", async (req, res) => {
    try {
        const searchdata = await User.find({ userName: req.body.userName });
        console.log("searchdata-------------->>", searchdata);
        if (!searchdata) {
            return res.status(401).json({
                msg: "invalited data find"
            });
        };
        return res.status(200).json({
            msg: "okk sucess fully",
            count: searchdata.length,
            result: searchdata
        });
    } catch (error) {
        console.log("error----------------->>", error);
        res.status(500).json({
            msg: "internal server error",
            error: Error.message
        });
    };
});
router.post("/searchWithlastName", async (req, res) => {
    try {
        const searchdata = await User.find({ lastName: req.body.lastName });
        console.log("searchdata------------>>", searchdata);
        if (!searchdata) {
            return res.status(401).json({
                msg: "invalited data find"
            });
        };
        return res.status(200).json({
            msg: "okk sucessfullydata",
            count: searchdata.length,
            result: searchdata
        });
    } catch (error) {
        console.log("error----------------->>", error);
        res.status(500).json({
            msg: "internal server error",
            error: Error.message
        });
    };
});
module.exports = router;
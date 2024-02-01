const mongoose = require("mongoose");
const { secretKey } = require("./config");
const jwt = require("jsonwebtoken");
if (!token) {
    return res.status(401).json({
        msg: "no token"
    });
};
try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
} catch (error) {
    console.log("error------------------->>", error);
    res.status(500).json({
        msg: "internal server error",
        error: Error.message
    });
};
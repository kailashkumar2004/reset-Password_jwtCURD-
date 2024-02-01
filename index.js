const mongoose = require("mongoose");
const express = require("express");
const db = require("./src/db/db");
const router = require("./src/router");
const PORt = 5490;
const app = express();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");



app.get("/", (req, res) => {
    res.send("helo world")
});



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", router);
app.listen(PORt, () => {
    console.log(`server is runin on port ${PORt}`)
})
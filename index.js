const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

dotenv.config({ path: "./config.env" })

require("./db/conn");
const User = require("./model/userSchema")

app.use(express.json());

app.use(require("./router/auth"))

const PORT = process.env.PORT;

app.get("/login", (req, res) => {
    res.send("Hello login world from the server");
})

app.get("/signup", (req, res) => {
    res.send("Hello signup world from the server");
})

app.get("/main", (req, res) => {
    console.log("Hello main")
    res.send("Hello main world from the server");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
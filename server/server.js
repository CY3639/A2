const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
// var fs = require("fs"); accesslog stream
// var morgan = require("morgan"); the logger
// var path = require("path");
const app = express();
dotenv.config();
const PORT = process.env.PORT;
const indexRouter = require("./src/routes/index");

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
}
const mongoDB = process.env.MONGODB_URI;
main().catch((error) => console.log(error));

async function main() {
    await mongoose.connect(mongoDB);
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`Received request for route: ${req.originalUrl}`);
    next();
});

app.use("/api", indexRouter);

app.get("/api/health", (req, res) => {
    res.json({ ok: true, uptime: process.uptime() });
});

app.get("/", (req, res) => {
    res.send("IFN666 Assessment 2");
});

app.listen(PORT, (error) => {
    if (!error)
        console.log(`Server is listening on http://localhost:${PORT}`);
    else
        console.log("Error occurred, server cannot start", error);
    }
);

module.exports = app;
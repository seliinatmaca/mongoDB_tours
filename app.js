const express = require("express");
const { getAllTours, createTour } = require("./controllers/tourController.js");
const tourRouter = require("./routes/tourRoutes.js");
const userRouter = require("./routes/userRoutes.js");

const app = express();
const morgan = require("morgan");

//gelen istekleri loglar
app.use(morgan("dev"));

//gelen isteklerin body'sine eriş
app.use(express.json());

//turlar ile alakalı yolları projeye tanıt
app.use("/api/tours", tourRouter);
app.use("/api/users", userRouter);

module.exports = app;

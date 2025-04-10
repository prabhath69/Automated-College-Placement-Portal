require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const studentRouter = require("./routes/studentRoutes")
const cdcRouter=require("./routes/CdcRoutes")
const errorHandler = require("./middlewares/Errhandler");
const URL=process.env.MONGO_URL

const app = express();

//!Connect to mongodb
mongoose
  .connect(URL)
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log(e));

//! Cors config
const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
//!Middlewares
app.use(express.json()); //?Pass incoming json data
//!Routes
app.use("/", studentRouter);
app.use("/", cdcRouter);
// app.use("/", userRouter);
// app.use("/", categoryRouter);
// app.use("/", transactionRouter);
//! Error
app.use(errorHandler);

//!Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server is running on this port... ${PORT} `)
);
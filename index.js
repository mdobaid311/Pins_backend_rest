const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
require("dotenv").config();
const connectDB = require("./db/connectDB");
const cloudinary = require('cloudinary').v2;
const helmet = require("helmet");
const fileUpload = require('express-fileupload');

const helperRouter = require("./routes/helper");
const dallERouter = require("./routes/dallE")


const app = express();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(fileUpload({
  useTempFiles: true
}));

app.get("/",(req,res)=>{
  res.json("working")
})

app.use("/api/v1/helper", helperRouter)
app.use("/api/v1/dalle", dallERouter)

const port = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI);
app.listen(port, () => {
  console.log(`listening on port ${port}`.yellow.bold);
});

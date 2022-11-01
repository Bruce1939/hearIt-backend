const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./config/connectDB");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

connectDB();

app.listen(process.env.PORT || 5000, () =>
    console.log(`server started on port ${process.env.PORT || 5000}`)
);

app.use("/auth", authRoutes);

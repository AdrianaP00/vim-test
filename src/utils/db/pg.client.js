const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ragRoutes = require("./routes/ragRoutes");
const {art} = require("./ascii.js")
require("dotenv").config({debug:true});


const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

app.use("/api/rag", ragRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`${art} \n\nServer running on port ${PORT}`));

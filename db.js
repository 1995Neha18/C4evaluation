const mongoose= require("mongoose");
require("dotenv").config();

const url= process.env.ATLESURL

const connection = mongoose.connect(url);

module.exports= connection;
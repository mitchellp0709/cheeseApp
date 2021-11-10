////////////////////////////////
//dependencies
////////////////////////////////

// get env variables
require("dotenv").config();

//pull port from .env
const { PORT = 3001, DATABASE_URL } = process.env;

//import express
const express = require("express");

//create app object

const app = express();

//import mongoose
const mongoose = require("mongoose");

//import cors
const cors = require("cors");

//import morgan
const morgan = require("morgan");

////////////////////////////////
//database connection
////////////////////////////////

mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

//connection events

mongoose.connection
  .on("open", () => console.log("you are connected to mongoose"))
  .on("close",()=>console.log("you are disconnected from mongoose"))
  .on("error",(error)=>console.log({error}))


////////////////////////////////
//models
////////////////////////////////

const CheeseSchema = new mongoose.Schema({
  name: String,
  countryOfOrigin: String,
  image: String
}, {timestamps:true}
)

const Cheese= mongoose.model("Cheese",CheeseSchema)


////////////////////////////////
//middleware
////////////////////////////////

//cors to prevent cors errors an dopen access to all origins
app.use(cors())

//morgan for logging
app.use(morgan("dev"))

//parse json bodies
app.use(express.json())



////////////////////////////////
//routes
////////////////////////////////

//test route

app.get("/", (req, res) => {
  res.send("hello world")
})



//index route

app.get("/cheese", async (req, res) => {
  try {
    res.json(await Cheese.find({}))
  } catch (error) {
    res.status(400).json(error)
  }
})


//create route

app.post("/cheese", async (req, res) => {
  try {
    res.json(Cheese.create(req.body))
  } catch (error) {
    res.status(400).json(error)
  }
})


//update route

app.put("/cheese/:id", async (req, res) => {
  try {
    res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  }  catch (error) {
    res.status(400).json(error)
  }
})

//delete route

app.delete("/cheese/:id", async (req, res) => {
  try {
    res.json(await Cheese.findByIdAndRemove(req.params.id))
  } catch (error) {
    res.status(400).json(error)
  }
})



////////////////////////////////
//listener
////////////////////////////////

app.listen(PORT,()=>{console.log(`listening on PORT ${PORT}`)})

require('dotenv').config()

const express=require('express');
const cors=require('cors');


const userRoutes=require("../routes/users.routes");


const app=express();

app.use(cors());
app.use(express.json())

//routes
app.use('/users',userRoutes);


module.exports=app;

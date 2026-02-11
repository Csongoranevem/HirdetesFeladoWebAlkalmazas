
require('dotenv').config()

const express=require('express');
const cors=require('cors');


const userRoutes=require("../routes/users.routes");
const advertRoutes=require("../routes/adverts.routes");
const conuntryRoutes=require("../routes/countries.routes");


const app=express();

app.use(cors());
app.use(express.json())

//routes
app.use('/users',userRoutes);
app.use('/adverts',advertRoutes);
app.use('/countries',conuntryRoutes);


module.exports=app;

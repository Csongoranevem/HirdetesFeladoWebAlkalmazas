require('dotenv').config()

const express=require('express');
const cors=require('cors');
const path=require('path');


const userRoutes=require("../routes/users.routes");
const advertRoutes=require("../routes/adverts.routes");
const cityRoutes=require("../routes/city.routes");
const categoryRoutes=require("../routes/categories.routes");
const paymentRoutes=require("../routes/payments.routes");
const conditionRoutes=require("../routes/conditions.routes");
const supportRoutes=require("../routes/support.routes");
const imagesRoutes=require("../routes/images.routes");
const ratingRoutes=require("../routes/rating.routes");
const commentRoutes=require("../routes/comment.routes");
const wishlistRoutes=require("../routes/wishlist.routes");
const interestRoutes=require("../routes/interest.routes");

const app=express();

app.use(cors());
app.use(express.json())

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

//routes
app.use('/users',userRoutes);
app.use('/adverts',advertRoutes);
app.use('/cities', cityRoutes);
app.use('/categories',categoryRoutes);
app.use('/payments',paymentRoutes);
app.use('/conditions',conditionRoutes);
app.use('/support',supportRoutes);
app.use('/images',imagesRoutes);
app.use('/ratings',ratingRoutes);
app.use('/comments',commentRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/interests', interestRoutes);
module.exports=app;

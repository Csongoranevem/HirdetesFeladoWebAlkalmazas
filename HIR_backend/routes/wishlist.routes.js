const router=require('express').Router();
const{Wishlist}=require('../models/index');
const bcrypt = require('bcrypt');
const { operatorMap } = require('../models/index');
const { authenticate} = require('../middlewares/auth.middleware');


// Get all wishlists
router.get('/', authenticate,async(_req,res)=>{
    const wishlists=await Wishlist.findAll();
    res.status(200).json(wishlists);
});

//GET wishlist by id
router.get('/:id', authenticate,async(req,res)=>{
    const id=req.params.id;
    const wishlist=await Wishlist.findByPk(id);
    if(!wishlist){
        return res.status(404).json({message:"Wishlist not found!"})
    }
    res.status(200).json(wishlist);
});

//Post new wishlist
router.post('/', authenticate,async (req,res)=>{
    const { userId, advertId } = req.body;
    const wishlist = await Wishlist.create({ userId, advertId });
    res.status(201).json(wishlist);
});

//DELETE wishlist by id
router.delete('/:id', authenticate,async (req,res)=>{
    const id=req.params.id;
    const wishlist=await Wishlist.findByPk(id);
    if(!wishlist){
        return res.status(404).json({message:"Wishlist not found!"})
    }
    await wishlist.destroy();
    res.status(204).json({message: 'Deleted wishlist successfully! '})
});

module.exports = router;

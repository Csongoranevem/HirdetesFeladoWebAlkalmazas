const router=require('express').Router();
const{City}=require('../models/index')


//City CRUD operators

//GET all cities from table

router.get('/',async(_req,res)=>{
    const cities=await City.findAll();
    res.status(200).json(cities);
});


//GET city by id
router.get('/:id',async(req,res)=>{
    const id=req.params.id;
    const city=await City.findByPk(id);
    if(!city){
        return res.status(404).json({message:"City not found!"})
    }
    res.status(200).json(city);
});


//CREATE new city
router.post('/',async (req,res)=>{

    try{
    const{ name }=req.body;

    const city=await City.create({ name });

    res.status(201).json(city);
    }
    catch(err)
    {
        res.status(500).json({message:'Creation failed', error:err.message});
    }
});

//UPDATE city by id
router.patch('/:id',async(req,res)=>{
     const id=req.params.id;
     const city=await City.findByPk(id);
    if(!city){
        return res.status(404).json({message:"City not found!"})
    }
    const updatedCity=await city.update(req.body);
    res.status(200).json(updatedCity);
});


//DELETE city by id
router.delete('/:id',async (req,res)=>{
    const id=req.params.id;
    const city=await City.findByPk(id);
    if(!city){
        return res.status(404).json({message:"City not found!"})
    }
    await city.destroy();
    res.status(204).json({message: 'Deleted city successfully! '})

});



module.exports=router;
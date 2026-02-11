const router=require('express').Router();
const{Country}=require('../models/index')


//Country CRUD operators

//GET all countries from table

router.get('/',async(_req,res)=>{
    const countries=await Country.findAll();
    res.status(200).json(countries);
});


//GET country by id
router.get('/:id',async(req,res)=>{
    const id=req.params.id;
    const country=await Country.findByPk(id);
    if(!country){
        return res.status(404).json({message:"Country's not found!"})
    }
    res.status(200).json(country);
});


//CREATE new country
router.post('/',async (req,res)=>{

    try{
    const{ name,code}=req.body;
        
    

    const country=await Country.create({name, code});

    res.status(201).json(country);
    }
    catch(err)
    {
        res.status(500).json({message:'Creation failed', error:err.message});
    }
});

//UPDATE country by id
router.patch('/:id',async(req,res)=>{
     const id=req.params.id;
     const country=await Country.findByPk(id);
    if(!country){
        return res.status(404).json({message:"Country's not found!"})
    }
    const updatedCountry=await country.update(req.body);
    res.status(200).json(updatedCountry);
});


//DELETE country by id
router.delete('/:id',async (req,res)=>{
    const id=req.params.id;
    const country=await Country.findByPk(id);
    if(!country){
        return res.status(404).json({message:"Country's not found!"})
    }
    await country.destroy();
    res.status(204).json({message: 'Deleted country successfully! '})

});



module.exports=router;
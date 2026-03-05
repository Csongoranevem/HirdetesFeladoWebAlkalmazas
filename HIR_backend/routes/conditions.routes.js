const router=require('express').Router();
const{Condition}=require('../models/index')


//Condition CRUD operators

//GET all conditions from table

router.get('/',async(_req,res)=>{
    const conditions=await Condition.findAll();
    res.status(200).json(conditions);
});


//GET condition by id
router.get('/:id',async(req,res)=>{
    const id=req.params.id;
    const condition=await Condition.findByPk(id);
    if(!condition){
        return res.status(404).json({message:"Condition's not found!"})
    }
    res.status(200).json(condition);
});


//CREATE new condition   
router.post('/',async (req,res)=>{

    try{
    const{ name}=req.body;
        
    

    const condition=await Condition.create({name});

    res.status(201).json(condition);
    }
    catch(err)
    {
        res.status(500).json({message:'Creation failed', error:err.message});
    }
});

//UPDATE condition by id
router.patch('/:id',async(req,res)=>{
     const id=req.params.id;
     const condition=await Condition.findByPk(id);
    if(!condition){
        return res.status(404).json({message:"Condition's not found!"})
    }
    const updatedCondition=await condition.update(req.body);
    res.status(200).json(updatedCondition);
});


//DELETE condition by id
router.delete('/:id',async (req,res)=>{
    const id=req.params.id;
    const condition=await Condition.findByPk(id);
    if(!condition){
        return res.status(404).json({message:"Condition's not found!"})
    }
    await condition.destroy();
    res.status(204).json({message: 'Deleted condition successfully! '})

});



module.exports=router;
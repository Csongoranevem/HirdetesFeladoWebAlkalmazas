const router=require('express').Router();
const{Category}=require('../models/index')


//Category CRUD operators

//GET all categories from table

router.get('/',async(_req,res)=>{
    const categories=await Category.findAll();
    res.status(200).json(categories);
});


//GET category by id
router.get('/:id',async(req,res)=>{
    const id=req.params.id;
    const category=await Category.findByPk(id);
    if(!category){
        return res.status(404).json({message:"Category's not found!"})
    }
    res.status(200).json(category);
});


//CREATE new category   
router.post('/',async (req,res)=>{

    try{
    const{ name,code}=req.body;
        
    

    const category=await Category.create({name, code});

    res.status(201).json(category);
    }
    catch(err)
    {
        res.status(500).json({message:'Creation failed', error:err.message});
    }
});

//UPDATE category by id
router.patch('/:id',async(req,res)=>{
     const id=req.params.id;
     const category=await Category.findByPk(id);
    if(!category){
        return res.status(404).json({message:"Category's not found!"})
    }
    const updatedCategory=await category.update(req.body);
    res.status(200).json(updatedCategory);
});


//DELETE category by id
router.delete('/:id',async (req,res)=>{
    const id=req.params.id;
    const category=await Category.findByPk(id);
    if(!category){
        return res.status(404).json({message:"Category's not found!"})
    }
    await category.destroy();
    res.status(204).json({message: 'Deleted category successfully! '})

});



module.exports=router;
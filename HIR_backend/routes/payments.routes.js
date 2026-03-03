const router=require('express').Router();
const{Payment}=require('../models/index')


//Payment CRUD operators

//GET all payments from table

router.get('/',async(_req,res)=>{
    const payments=await Payment.findAll();
    res.status(200).json(payments);
});


//GET payment by id
router.get('/:id',async(req,res)=>{
    const id=req.params.id;
    const payment=await Payment.findByPk(id);
    if(!payment){
        return res.status(404).json({message:"Payment's not found!"})
    }
    res.status(200).json(payment);
});


//CREATE new payment   
router.post('/',async (req,res)=>{

    try{
    const{ name}=req.body;
        
    

    const payment=await Payment.create({name});

    res.status(201).json(payment);
    }
    catch(err)
    {
        res.status(500).json({message:'Creation failed', error:err.message});
    }
});

//UPDATE payment by id
router.patch('/:id',async(req,res)=>{
     const id=req.params.id;
     const payment=await Payment.findByPk(id);
    if(!payment){
        return res.status(404).json({message:"Payment's not found!"})
    }
    const updatedPayment=await payment.update(req.body);
    res.status(200).json(updatedPayment);
});


//DELETE payment by id
router.delete('/:id',async (req,res)=>{
    const id=req.params.id;
    const payment=await Payment.findByPk(id);
    if(!payment){
        return res.status(404).json({message:"Payment's not found!"})
    }
    await payment.destroy();
    res.status(204).json({message: 'Deleted payment successfully! '})

});



module.exports=router;
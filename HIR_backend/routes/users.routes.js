const router=require('express').Router();
const{User}=require('../models/index')


//USER CRUD operators

router.get('/',async(_req,res)=>{
    const users=await User.findAll();
    res.status(200).json(users);
});

router.get('/:id',async(req,res)=>{
    const id=req.params.id;
    const user=await User.findByPk(id);
    if(!user){
        return res.status(404).json({message:"User's not found!"})
    }
    res.status(200).json(user);
});

router.post('/register',async (req,res)=>{

    try{
    const{ name,email,password,confirm }=req.body;
    
    //Validációk...

    const user=await User.create({name, email, password});

    res.status(201).json(user);
    }
    catch(err)
    {
        res.status(500).json({message:'Registration failed', error:err.message});
    }
});

router.patch('/:id',async(req,res)=>{
     const id=req.params.id;
     const user=await User.findByPk(id);
    if(!user){
        return res.status(404).json({message:"User's not found!"})
    }
    const updatedUser=await user.update(req.body);
    res.status(200).json(updatedUser);
});

router.delete('/:id',async (req,res)=>{
    const id=req.params.id;
    const user=await User.findByPk(id);
    if(!user){
        return res.status(404).json({message:"User's not found!"})
    }
    await user.destroy();
    res.status(204).json({message: 'Deleted user successfully! '})

});



module.exports=router;
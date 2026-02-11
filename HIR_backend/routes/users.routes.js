const router=require('express').Router();
const{User}=require('../models/index')


//USER CRUD operators

//GET all users from table

router.get('/',async(_req,res)=>{
    const users=await User.findAll();
    res.status(200).json(users);
});


//GET user by id
router.get('/:id',async(req,res)=>{
    const id=req.params.id;
    const user=await User.findByPk(id);
    if(!user){
        return res.status(404).json({message:"User's not found!"})
    }
    res.status(200).json(user);
});


//CREATE new user
router.post('/register',async (req,res)=>{

    try{
    const{ name,email,backup_email, phone, address, password }=req.body;
    
    

    const user=await User.create({name, email, backup_email, phone, address, password});

    res.status(201).json(user);
    }
    catch(err)
    {
        res.status(500).json({message:'Registration failed', error:err.message});
    }
});

//UPDATE user by id
router.patch('/:id',async(req,res)=>{
     const id=req.params.id;
     const user=await User.findByPk(id);
    if(!user){
        return res.status(404).json({message:"User's not found!"})
    }
    const updatedUser=await user.update(req.body);
    res.status(200).json(updatedUser);
});


//DELETE user by id
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
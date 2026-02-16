const router=require('express').Router();
const{User}=require('../models/index');
const bcrypt = require('bcrypt');
const { authenticate, generateToken } = require('../middlewares/auth.middleware');

//USER CRUD operators

//GET all users from table

router.get('/', authenticate,async(_req,res)=>{
    const users=await User.findAll();
    res.status(200).json(users);
});


//GET user by id
router.get('/:id', authenticate,async(req,res)=>{
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


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.scope('withPassword').findOne({ where: { email } });

    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.status) {
        return res.status(403).json({ error: 'User is inactive or banned' });
    }

    const token = generateToken(user.toJSON());

    const lastLogin = await User.update({ lastLogin: new Date() }, { where: { id: user.id } });

    res.json({ message: 'Login successful', token });
});



//UPDATE user by id
router.patch('/:id', authenticate,async(req,res)=>{
     const id=req.params.id;
     const user=await User.findByPk(id);
    if(!user){
        return res.status(404).json({message:"User's not found!"})
    }
    const updatedUser=await user.update(req.body);
    res.status(200).json(updatedUser);
});


//DELETE user by id
router.delete('/:id', authenticate,async (req,res)=>{
    const id=req.params.id;
    const user=await User.findByPk(id);
    if(!user){
        return res.status(404).json({message:"User's not found!"})
    }
    await user.destroy();
    res.status(204).json({message: 'Deleted user successfully! '})

});



module.exports=router;
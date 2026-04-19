const router=require('express').Router();
const{Support}=require('../models/index')
const { Op } = require('sequelize');
const emailService = require('../services/email.service');


//Support CRUD operators

//GET all supports from table

router.get('/',async(_req,res)=>{
    const supports=await Support.findAll();
    res.status(200).json(supports);
});


//GET support by id
router.get('/:id',async(req,res)=>{
    const id=req.params.id;
    const support=await Support.findByPk(id);
    if(!support){
        return res.status(404).json({message:"Support entry not found!"})
    }
    res.status(200).json(support);
});

//get support by field
router.get('/:field/:op/:value',async(req,res)=>{
    const ops = {
    eq: (field, value) => ({ [field]: value }),
    ne: (field, value) => ({ [field]: { [Op.ne]: value } }),
    gt: (field, value) => ({ [field]: { [Op.gt]: value } }),
    lt: (field, value) => ({ [field]: { [Op.lt]: value } })
};

    const field=req.params.field;
    const op=req.params.op;
    const value=req.params.value;
    const supports=await Support.findAll({ where: ops[op](field, value) });
    res.status(200).json(supports);

});


//CREATE new support
router.post('/',async (req,res)=>{

    try{
    const{ question, answer, topic }=req.body;
    const support=await Support.create({ question, answer, topic });
    res.status(201).json(support);
    }
    catch(err)
    {
        res.status(500).json({message:'Creation failed', error:err.message});
    }
});

// CONTACT SUPPORT: send email to ADMINMAIL
// POST /support/contact { email, subject, message }
router.post('/contact', async (req, res) => {
    try {
        const email = String(req.body?.email ?? '').trim();
        const subject = String(req.body?.subject ?? '').trim();
        const message = String(req.body?.message ?? '').trim();

        const missing = [];
        if (!email) missing.push('email');
        if (!subject) missing.push('subject');
        if (!message) missing.push('message');
        if (missing.length) {
            return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });
        }

        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailOk) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const result = await emailService.sendSupportContactEmail({
            fromEmail: email,
            subject,
            message
        });

        if (!result?.sent) {
            return res.status(503).json({ message: 'Email sending is not available', reason: result?.reason });
        }

        return res.status(200).json({ sent: true });
    } catch (err) {
        return res.status(500).json({ message: 'Support contact failed', error: err.message });
    }
});

//UPDATE support by id
router.patch('/:id',async(req,res)=>{
     const id=req.params.id;
     const support=await Support.findByPk(id);
    if(!support){
        return res.status(404).json({message:"Support entry not found!"})
    }
    const updatedSupport=await support.update(req.body);
    res.status(200).json(updatedSupport);
});


//DELETE support by id
router.delete('/:id',async (req,res)=>{
    const id=req.params.id;
    const support=await Support.findByPk(id);
    if(!support){
        return res.status(404).json({message:"Support entry not found!"})
    }
    await support.destroy();
    res.status(204).json({message: 'Deleted support successfully! '})

});



module.exports=router;

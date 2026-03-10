const router=require('express').Router();
const{Advert, Image}=require('../models/index')


//Advertisements CRUD operators

//GET all adverts from table

router.get('/',async(_req,res)=>{
    const adverts=await Advert.findAll({
        include: [{ model: Image, as: 'images' }]
    });
    res.status(200).json(adverts);
});


//GET advert by id
router.get('/:id',async(req,res)=>{
    const id=req.params.id;
    const advert=await Advert.findByPk(id, {
        include: [{ model: Image, as: 'images' }]
    });
    if(!advert){
        return res.status(404).json({message:"Advert's not found!"})
    }
    res.status(200).json(advert);
});

//get advert by field
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
    const adverts=await Advert.findAll({
        where: ops[op](field, value),
        include: [{ model: Image, as: 'images' }]
    });
    res.status(200).json(adverts);

});


//CREATE new advert
router.post('/',async (req,res)=>{

    try{
    const{ name,user_id,description,price, city_id, product_id, category_id, payment_method, status }=req.body;
    const advert=await Advert.create({name, user_id, description, price, city_id, product_id, category_id, payment_method, status});
    res.status(201).json(advert);
    }
    catch(err)
    {
        res.status(500).json({message:'Creation failed', error:err.message});
    }
});

//UPDATE advert by id
router.patch('/:id',async(req,res)=>{
     const id=req.params.id;
     const advert=await Advert.findByPk(id);
    if(!advert){
        return res.status(404).json({message:"Advert's not found!"})
    }
    const updatedAdvert=await advert.update(req.body);
    res.status(200).json(updatedAdvert);
});


//DELETE advert by id
router.delete('/:id',async (req,res)=>{
    const id=req.params.id;
    const advert=await Advert.findByPk(id);
    if(!advert){
        return res.status(404).json({message:"Advert's not found!"})
    }
    await advert.destroy();
    res.status(204).json({message: 'Deleted advert successfully! '})

});



module.exports=router;
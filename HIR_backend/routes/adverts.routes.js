const router=require('express').Router();
const{Advert, Image, Category, User}=require('../models/index')
const { Op, fn, col, where } = require('sequelize');
const emailService = require('../services/email.service');


//Advertisements CRUD operators

//GET all adverts from table

router.get('/',async(_req,res)=>{
    const adverts=await Advert.findAll({
        include: [{ model: Image, as: 'images' }]
    });
    res.status(200).json(adverts);
});

//SEARCH adverts by name (query string)
// GET /adverts/search?q=Sony%20kamera
router.get('/search', async (req, res) => {
    try {
        const queryRaw = String(req.query.q ?? '').trim();
        const limitRaw = Number(req.query.limit ?? 10);
        const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 10;

        if (!queryRaw) {
            return res.status(200).json([]);
        }

        const tokens = queryRaw
            .split(/\s+/)
            .map((token) => token.trim())
            .filter(Boolean)
            .slice(0, 10);

        // Whitespace-insensitive matching ("sonykamera" should match "Sony kamera")
        const compactQuery = queryRaw.replace(/\s+/g, '');
        // Qualify column to avoid ambiguity when joining Category (it also has a `name` column)
        const compactName = fn('REPLACE', col('adverts.name'), ' ', '');

        const whereClause = tokens.length <= 1
            ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${compactQuery}%` } },
                    where(compactName, { [Op.like]: `%${compactQuery}%` })
                ]
            }
            : {
                [Op.and]: tokens.map((token) => ({
                    name: { [Op.like]: `%${token}%` }
                }))
            };

        const adverts = await Advert.findAll({
            where: whereClause,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'],
                    required: false
                }
            ],
            attributes: ['id', 'name', 'price', 'status', 'category_id'],
            limit
        });

        res.status(200).json(adverts);
    } catch (err) {
        res.status(500).json({ message: 'Search failed', error: err.message });
    }
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
    const{ name,user_id,description,price, city_id, product_id, category_id, condition_id, payment_method, status }=req.body;
    const advert=await Advert.create({name, user_id, description, price, city_id, product_id, category_id, condition_id, payment_method, status});
    
    // Asynchronously send email notification if user has an email and category exists
    Category.findByPk(category_id).then(async (category) => {
        if (!category) return;
        const user = await User.findByPk(user_id);
        if (user && user.email) {
            // Retrieve image if attached separately (logic depends on your app) or just omit it
            let imageUrl = null;
            // Example: const image = await Image.findOne({ where: { advert_id: advert.id } });
            // if (image) imageUrl = image.url; // Or adjust according to how images are stored
            
            emailService.sendAdvertCreationEmail({
                to: user.email,
                advertName: name,
                categoryName: category.name,
                price: price,
                imageUrl: imageUrl
            }).catch(e => console.error("Email send error:", e));
        }
    }).catch(e => console.error("Error fetching category for email:", e));

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
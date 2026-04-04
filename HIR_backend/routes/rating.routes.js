const router = require('express').Router();
const { Rating } = require('../models/index')


//Rating CRUD operators

//GET all ratings from table

router.get('/', async (_req, res) => {
    const ratings = await Rating.findAll();
    res.status(200).json(ratings);
});

//GET rating by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const rating = await Rating.findByPk(id);
    if (!rating) {
        return res.status(404).json({ message: "Rating entry not found!" })
    }
    res.status(200).json(rating);
});

//  GET records by filed value with operator
router.get('/:field/:op/:value', async (req, res) => {
    const { field, op, value } = req.params;
    if (!field || !op || value === undefined) {
        return res.status(400).json({ message: "Missing field, operator, or value in query parameters" });
    }
    const operator = Rating.sequelize.Op[op];
    if (!operator) {
        return res.status(400).json({ message: "Invalid operator" });
    }
    try {
        const ratings = await Rating.findAll({
            where: {
                [field]: { [operator]: value }
            }
        });
        res.status(200).json(ratings);
    }
    catch (err) {
        res.status(500).json({ message: 'Query failed', error: err.message });
    }
});

//CREATE new rating
router.post('/', async (req, res) => {
    try {
        const { ad_id, rating, user_id } = req.body;
        const newRating = await Rating.create({ ad_id, rating, user_id });
        res.status(201).json(newRating);
    }
    catch (err) {
        res.status(500).json({ message: 'Creation failed', error: err.message });
    }
});

//UPDATE rating by id
router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const rating = await Rating.findByPk(id);
    if (!rating) {
        return res.status(404).json({ message: "Rating entry not found!" })
    }
    const { ad_id, rating: newRating, user_id } = req.body;
    await rating.update({ ad_id, rating: newRating, user_id });
    res.status(200).json(rating);
});


//DELETE rating by id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const rating = await Rating.findByPk(id);
    if (!rating) {
        return res.status(404).json({ message: "Rating entry not found!" })
    }
    await rating.destroy();
    res.status(204).send();
});

module.exports = router;

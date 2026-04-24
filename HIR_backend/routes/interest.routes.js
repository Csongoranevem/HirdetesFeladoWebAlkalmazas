const router = require('express').Router();
const { Interest } = require('../models/index')


//Interest CRUD operators

//GET all interests from table

router.get('/', async (_req, res) => {
    const interests = await Interest.findAll();
    res.status(200).json(interests);
});

//GET interest by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const interest = await Interest.findByPk(id);
    if (!interest) {
        return res.status(404).json({ message: "Interest entry not found!" })
    }
    res.status(200).json(interest);
});

//  GET records by filed value with operator
router.get('/:field/:op/:value', async (req, res) => {
    const { field, op, value } = req.params;
    if (!field || !op || value === undefined) {
        return res.status(400).json({ message: "Missing field, operator, or value in query parameters" });
    }
    const operator = Interest.sequelize.Op[op];
    if (!operator) {
        return res.status(400).json({ message: "Invalid operator" });
    }
    try {
        const interests = await Interest.findAll({
            where: {
                [field]: { [operator]: value }
            }
        });
        res.status(200).json(interests);
    }
    catch (err) {
        res.status(500).json({ message: 'Query failed', error: err.message });
    }
});

//CREATE new interest
router.post('/', async (req, res) => {
    try {
        const { ad_id, message, user_id } = req.body;
        const newInterest = await Interest.create({ ad_id, message, user_id });
        res.status(201).json(newInterest);
    }
    catch (err) {
        res.status(500).json({ message: 'Creation failed', error: err.message });
    }
});

//UPDATE interest by id
router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const interest = await Interest.findByPk(id);
    if (!interest) {
        return res.status(404).json({ message: "Interest entry not found!" })
    }
    const { ad_id, message, user_id } = req.body;
    await interest.update({ ad_id, message, user_id });
    res.status(200).json(interest);
});


//DELETE interest by id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const interest = await Interest.findByPk(id);
    if (!interest) {
        return res.status(404).json({ message: "Interest entry not found!" })
    }
    await interest.destroy();
    res.status(204).send();
});

module.exports = router;

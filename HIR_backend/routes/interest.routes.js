const router = require('express').Router();
const { Interest, Advert, User } = require('../models/index')
const emailService = require('../services/email.service');


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

        if (!ad_id || !user_id) {
            return res.status(400).json({ message: 'Missing ad_id or user_id' });
        }

        const advert = await Advert.findByPk(ad_id);
        if (!advert) {
            return res.status(404).json({ message: 'Advert not found' });
        }

        if (String(advert.user_id) === String(user_id)) {
            return res.status(403).json({ message: 'Cannot create interest on your own advert' });
        }

        const newInterest = await Interest.create({ ad_id, message, user_id });

        // Notify advert owner via email (best-effort; should not block creation)
        try {
            const owner = await User.findByPk(advert.user_id);
            if (owner?.email) {
                void emailService.sendInterestReceivedEmail({
                    to: owner.email,
                    advertName: advert.name,
                    interestMessage: message
                }).catch((err) => {
                    console.error('Interest received email failed:', err);
                });
            }
        } catch (emailErr) {
            console.error('Interest received email lookup failed:', emailErr);
        }

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

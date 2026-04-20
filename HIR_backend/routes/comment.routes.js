const router = require('express').Router();
const { Comment } = require('../models/index')
const { Op } = require('sequelize');


//Comment CRUD operators

//GET all comments from table

router.get('/', async (_req, res) => {
    const comments = await Comment.findAll();
    res.status(200).json(comments);
});

//GET comment by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const comment = await Comment.findByPk(id);
    if (!comment) {
        return res.status(404).json({ message: "Comment entry not found!" })
    }
    res.status(200).json(comment);
});

//  GET records by filed value with operator
router.get('/:field/:op/:value', async (req, res) => {
    const { field, op, value } = req.params;
    if (!field || !op || value === undefined) {
        return res.status(400).json({ message: "Missing field, operator, or value in query parameters" });
    }
    
    // Access the Operator map safely from Sequelize directly
    const operator = Op[op];
    if (!operator) {
        return res.status(400).json({ message: "Invalid operator" });
    }
    try {
        const comments = await Comment.findAll({
            where: {
                [field]: { [operator]: value }
            }
        });
        res.status(200).json(comments);
    }
    catch (err) {
        res.status(500).json({ message: 'Query failed', error: err.message });
    }
});

//CREATE new comment
router.post('/', async (req, res) => {
    try {
        const { ad_id, comment, user_id } = req.body;
        const newComment = await Comment.create({ ad_id, comment, user_id });
        res.status(201).json(newComment);
    }
    catch (err) {
        res.status(500).json({ message: 'Creation failed', error: err.message });
    }
});

//UPDATE comment by id
router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const comment = await Comment.findByPk(id);
    if (!comment) {
        return res.status(404).json({ message: "Comment entry not found!" })
    }
    const { ad_id, comment: newComment, user_id } = req.body;
    await comment.update({ ad_id, comment: newComment, user_id });
    res.status(200).json(comment);
});


//DELETE comment by id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const comment = await Comment.findByPk(id);
    if (!comment) {
        return res.status(404).json({ message: "Comment entry not found!" })
    }
    await comment.destroy();
    res.status(204).send();
});

module.exports = router;

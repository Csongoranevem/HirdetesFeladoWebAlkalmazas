
const router=require('express').Router();
const{Image}=require('../models/index');

//Image CRUD operators

//POST new image
router.post('/', async (req, res) => {
    try {
        const newImage = await Image.create(req.body);
        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//GET all images
router.get('/', async (req, res) => {
    try {
        const images = await Image.findAll();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//GET image by ID
router.get('/:id', async (req, res) => {
    try {
        const image = await Image.findByPk(req.params.id);
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//PATCH update image
router.patch('/:id', async (req, res) => {
    try {
        const [updated] = await Image.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) {
            return res.status(404).json({ error: 'Image not found' });
        }
        const updatedImage = await Image.findByPk(req.params.id);
        res.status(200).json(updatedImage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//DELETE image
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Image.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports=router;

const router=require('express').Router();
const{Image}=require('../models/index');
const multer=require('multer');
const path=require('path');
const fs=require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp|avif|jfif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

//Image CRUD operators

//POST new image with file upload
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const { advert_id, alt } = req.body;
        const url = `/uploads/${req.file.filename}`;
        const newImage = await Image.create({ advert_id, url, alt: alt || 'ad image' });
        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

//GET images by advert_id
router.get('/advert/:advert_id', async (req, res) => {
    try {
        const images = await Image.findAll({ where: { advert_id: req.params.advert_id } });
        res.status(200).json(images);
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
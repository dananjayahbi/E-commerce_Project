const router = require('express').Router();
const { protect } = require('../middleware/authorization');

const {
    addBrand,
    getBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
    uploadImage
} = require('../controllers/BrandController');

//ADD UNIT
router.post('/addBrand', protect, addBrand);

//GET ALL UNITS
router.get('/getBrands', getBrands);

//GET UNIT BY ID
router.get('/getBrandById/:id', protect, getBrandById);

//UPDATE UNIT
router.put('/updateBrand/:id', protect, updateBrand);

//DELETE UNIT
router.delete('/deleteBrand/:id', protect, deleteBrand);

//UPLOAD IMAGE
router.post('/uploadImage', uploadImage);

module.exports = router;
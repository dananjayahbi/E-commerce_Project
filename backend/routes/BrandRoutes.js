const router = require('express').Router();
const { protect } = require('../middleware/authorization');

const {
    addBrand,
    getBrands,
    getBrandById,
    updateBrand,
    deleteBrand
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

module.exports = router;
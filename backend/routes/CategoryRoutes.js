const router = require('express').Router();
const { protect } = require('../middleware/authorization');

const {
    addCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/CategoryController');

//ADD CATEGORY
router.post('/addCategory', protect, addCategory);

//GET ALL CATEGORIES
router.get('/getCategories', getCategories);

//GET CATEGORY BY ID
router.get('/getCategoryById/:id', protect, getCategoryById);

//UPDATE CATEGORY
router.put('/updateCategory/:id', protect, updateCategory);

//DELETE CATEGORY
router.delete('/deleteCategory/:id', protect, deleteCategory);

module.exports = router;
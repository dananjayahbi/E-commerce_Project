const router = require('express').Router();
const { protect } = require('../middleware/authorization');

const {
    addUnit,
    getUnits,
    getUnitById,
    updateUnit,
    deleteUnit
} = require('../controllers/UnitController');

//ADD UNIT
router.post('/addUnit', protect, addUnit);

//GET ALL UNITS
router.get('/getUnits', getUnits);

//GET UNIT BY ID
router.get('/getUnitById/:id', protect, getUnitById);

//UPDATE UNIT
router.put('/updateUnit/:id', protect, updateUnit);

//DELETE UNIT
router.delete('/deleteUnit/:id', protect, deleteUnit);

module.exports = router;
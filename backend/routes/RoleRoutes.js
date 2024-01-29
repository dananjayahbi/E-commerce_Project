const router = require('express').Router();
const { protect } = require('../middleware/authorization');

const {
    addRole,
    getRoles,
    getRoleById,
    getRoleByRoleName,
    updateRole,
    deleteRole,
} = require('../controllers/RoleController');

//ADD ROLE
router.post('/addRole', protect, addRole);

//GET ALL ROLES
router.get('/getRoles', getRoles);

//GET ROLE BY ID
router.get('/getRoleById/:id', protect, getRoleById);

//GET ROLE BY ROLE NAME
router.get('/getRoleByRoleName/:roleName', protect, getRoleByRoleName);

//UPDATE ROLE
router.put('/updateRole/:id', protect, updateRole);

//DELETE ROLE
router.delete('/deleteRole/:id', protect, deleteRole);

module.exports = router;
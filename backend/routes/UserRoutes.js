const router = require('express').Router();
const { protect } = require('../middleware/authorization');

const {
    register,
    login,
    getNewToken,
    getAllUsers,
    getUserById,
    updateUser,
    changePassword,
    resetPassword,
    verifyOTP,
    emailVerify,
    deleteUser,
} = require('../controllers/UserController');

//REGISTER USER
router.post('/register', register);

//LOGIN USER
router.post('/login', login);

//GET NEW TOKEN
router.get('/token/:id', getNewToken);

//GET ALL USERS
router.get('/getAllUsers', getAllUsers);

//GET USER BY ID
router.get('/getUserById/:id', protect, getUserById);

//UPDATE USER
router.put('/updateUser/:id', protect, updateUser);

//CHANGE PASSWORD
router.put('/changePassword/:id', protect, changePassword);

//RESET PASSWORD
router.put('/resetPassword', resetPassword);

//VERIFY OTP
router.get('/verifyOTP', verifyOTP);

//HANDLE OTP
router.get('/handleOTP', emailVerify);

//DELETE USER
router.delete('/deleteUser/:id', protect, deleteUser);

module.exports = router;
const router = require('express').Router();

const {
    uploadDashboardLogo,
    getDashboardLogo,
    checkSystemOnline,
} = require('../controllers/SystemSettingsController');

//UPLOAD DASHBOARD LOGO
router.post('/uploadDashboardLogo', uploadDashboardLogo);

//GET DASHBOARD LOGO
router.get('/getDashboardLogo', getDashboardLogo);

//CHECK SYSTEM ONLINE
router.get('/checkSystemOnline', checkSystemOnline);

module.exports = router;
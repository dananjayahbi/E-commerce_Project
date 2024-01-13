const router = require('express').Router();

const {
    uploadDashboardLogo,
    getDashboardLogo,
} = require('../controllers/SystemSettingsController');

//UPLOAD DASHBOARD LOGO
router.post('/uploadDashboardLogo', uploadDashboardLogo);

//GET DASHBOARD LOGO
router.get('/getDashboardLogo', getDashboardLogo);

module.exports = router;
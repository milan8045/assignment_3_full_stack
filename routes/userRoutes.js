const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isDriver } = require('../middlewares/auth');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/add-g2-user', userController.addG2User);
router.post('/get-user', userController.getUser);
router.post('/update-car', userController.updateCar);

router.get('/g2', isDriver, (req, res) => {
    const user = req.session.user;
    res.render('g2', { user });
});

router.get('/g', isDriver, (req, res) => {
    const user = req.session.user;
    res.render('g', { user, error: null });
});

module.exports = router;

let express = require('express');
let authController = require('../controller/authController');
let router = express.Router();
let auth = require('../middlewares/auth')


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);
router.get('/refresh', authController.refresh);


module.exports = router;
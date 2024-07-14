const express = require('express');
const router = express.Router();
const registerController = require('../routes/registerController');

router.post('/register', registerController.createdUser);
router.put('/verify/:id', registerController.verifyMail);
router.post('/login', registerController.jwtLogin);
router.post('/admin', registerController.adminLogin);
router.post('/req-reset-password', registerController.ResetPassword);
router.post('/valid-password-token', registerController.ValidPasswordToken);
router.post('/new-password', registerController.NewPassword);

module.exports = router;







// const express = require('express');
// const router = express.Router();

// const registerController=require('../routes/registerController')

// // router.get('/register',registerController.loadRegister);
// router.post('/register',registerController.createdUser);
// router.put('/verify/:id',registerController.verifyMail);
// router.post('/login',registerController.jwtLogin);
// // router.post('/admin',registerController.adminLogin)

// module.exports = router;
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// router.get('/user-details', userController.getUserDetails);
// router.get('/user/:userId', authUtils.verifyToken, userController.getOneUser);
// router.put('/user/:userId', authUtils.verifyToken, userController.updateUser); // Add this line

// router.get('/totalcountUser', userController.totalcount);
router.post('/adminRegistration', userController.adminRegistration);
router.post('/adminLogin', userController.adminLogin);
router.post('/userFeedback', userController.feedback);
router.post('/contactform', userController.Cform);
router.get('/AllFeedback', userController.Allfeedback);
router.get('/AllEmails', userController.AllEmails);
// router.post('/api/images/upload', userController.imageUpload);
// router.get('/api/images/all', userController.imageAll);
 module.exports = router;

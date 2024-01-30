const express = require('express');
const authController = require('../controllers/authController');
const authUtils = require('../utils/authUtils');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  // limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/AlluserDetails', authController.getAllUsers);
router.post('/upload', upload.single('fileFieldName'), authController.image);
router.get('/students/:userId',authController.getOneUser)
router.put('/users/:id',authController.UpdateUsers)
router.put('/buspass/accept/:userId',authController.updatebuspass)
router.put('/userUpdate/:id', authController.UserupdateId);
router.post('/resetpassword', authController.ResetPassword);
// router.put('/:userId',authController.updateUser); 
    
router.get('/image/:id', authController.getimage);
// router.post('/requestform', authController.requestform);
router.post('/requestform', authController.studentAttendence);
router.post('/Accept', authController.Accept);
router.post('/BusPassAccept', authController.BusPassAccept);
router.delete('/deleteform/:userId/requests/:requestId', authController.deleteFromRequested);

module.exports = router;

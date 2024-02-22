const express = require("express");
const router = express.Router();

const companyController = require("../controller/companyController");
const stdController = require("../controller/stdController");



// company 
router.post('/com-register',companyController.register);
router.post('/com-login',companyController.login);
router.post('/com-verify',companyController.verify);
router.use(companyController.isAuthenticated);


router.post('/post',companyController.createJob);



// student 
router.post('/user-register',stdController.register);
router.post('/user-login',stdController.login);
router.post('/user-verify',stdController.verify);

router.use(stdController.isAuthenticated);

router.post('/apply',stdController.applyJob);



module.exports = router;

const express = require("express");
const router = express.Router();

const companyController = require("../controller/companyController");


// company 
router.post('/com-register',companyController.register);
router.post('/com-login',companyController.login);
router.post('/com-verify',companyController.verify);
router.use(companyController.isAuthenticated);


router.post('/post',companyController.createJob);



module.exports = router;

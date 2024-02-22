const express = require("express");
const router = express.Router();

const stdController = require("../controller/stdController");


// student 
router.post('/user-register',stdController.register);
router.post('/user-login',stdController.login);
router.post('/user-verify',stdController.verify);

router.use(stdController.isAuthenticated);

router.post('/apply',stdController.applyJob);



module.exports = router;

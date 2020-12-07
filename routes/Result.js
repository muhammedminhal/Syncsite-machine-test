const express = require("express");
const router = express.Router();

const Result = require('../contollers/Result.controller')

//get all result for every one

router
.get('/result', Result.getResult)

module.exports = router;
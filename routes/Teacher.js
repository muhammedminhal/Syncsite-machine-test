const express = require("express");
const router = express.Router();

const teacherController = require('../contollers/Teacher.controller')


//   User Registration

router
    .post('/register', teacherController.registerUser)

    //User Login

    .post('/login', teacherController.loginUser)

    // Insert result

    .post('/result', teacherController.putResult)

// Get all Results

router
    .get('/result', teacherController.allResults)

    //view single Result

    .get('/result:id', teacherController.singleResult)

//Result edit

router
    .patch('/result:id', teacherController.editResult)

//Result Delete

router
    .delete('/result:id', teacherController.deleteResult)



module.exports = router;
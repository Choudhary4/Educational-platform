const express = require('express');
const router = express.Router();

const { auth } = require('../middlewares/authMiddleware')
const { deleteAccount, updateProfile, updateDisplayPicture, getAllUserDetails, getEnrolledCourses } = require('../controllers/profileController')

router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router
const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updateUserPassword } = require("../controllers/userController");
const router = express.Router(); 


router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/forgot/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updateUserPassword);

module.exports = router;
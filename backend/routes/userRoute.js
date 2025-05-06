const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updateUserPassword, updateUserProfile, getAllUsers, getSingleUser, updateRole, deleteUser } = require("../controllers/userController");
const router = express.Router(); 


router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/forgot/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updateUserPassword);

router.route("/me/update").put(isAuthenticatedUser, updateUserProfile);

router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser);

router.route("/admin/user/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateRole);

router.route("/admin/user/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);


module.exports = router;
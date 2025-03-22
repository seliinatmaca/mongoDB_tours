const express = require("express");
const userController = require("../controllers/userController.js");
const authController = require("../controllers/authController.js");

const router = express.Router();

router.post("/signup", authController.signUp);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

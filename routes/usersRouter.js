const { Router } = require("express");
const { body } = require("express-validator");

const userController = require("../controllers/usersController");
const userRouter = Router();

userRouter.post("/signup",
    [
        body("email").isEmail().withMessage("Invalid email"),
        body("firstName").notEmpty().withMessage("First name is required"),
        body("lastName").notEmpty().withMessage("Last name is required"),
        body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),
        body("passwordConfirmation")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Passwords do not match"),
    ],
    userController.createUser
);

module.exports = userRouter;
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const db = require("../db/queries");

const createUser = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            message: "Validation failed", 
            errors: errors.array() 
        });
    }

    try {
        const { email, firstName, lastName, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.createUser(firstName, lastName, email, hashedPassword);

        res.redirect("/");

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ 
            success: false, 
            message: "An error occurred while creating the user", 
            error: error.message 
        });
    }
};

const updateUserMembership = async (req, res) => {
    const username = res.locals.currentUser.email;
    const passcode = req.body.passcode;
    if (passcode === "membersonly")
    {
        await db.updateUserMembership(username);
        res.redirect("/");
    }
    else if (passcode === "admin")
    {
        await db.updateUserMembershipToAdmin(username);
        res.redirect("/");
    }
    else
    {
        res.status(500).json({ 
            success: false, 
            message: "passcode incorrect", 
        });
    }
}

module.exports = { createUser, updateUserMembership };

const db = require("../db/queries");

const createMessage = async (req, res) => {
    const { title, message, user } = req.body;
    await db.createMessage(title, message, user);
    res.redirect("/");
}


module.exports = { createMessage };

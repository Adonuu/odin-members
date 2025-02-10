const { Router } = require("express");

const messageController = require("../controllers/messageController");
const messageRouter = Router();

messageRouter.post("/create", messageController.createMessage);

module.exports = messageRouter;
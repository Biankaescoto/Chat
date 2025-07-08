const Message = require("../models/messageModel");
const Room = require("../models/roomModel");
const User = require("../models/userModel");
const { Types } = require("mongoose");

// Get all messages in a room
async function getRoomMessages(req, res) {
  const roomId = req.query.roomId;
  try {
    const messages = await Message.find({ room: roomId });
    console.log(messages);
    res.json(messages);
  } catch (err) {
    console.log("Error retrieving messages");
    res.status(500).json({ error: "Internal server error" });
  }
}

// create new message in a room
async function createRoomMessage(req, res) {
  try {
    const userId = req.userId;
    const { body, roomId } = req.body;
    const currentUser = await User.findById(userId);
    if (currentUser === null) {
      res.status(403).json({ error: "User does not exist." });
      return;
    }
    const newMessage = new Message({
      when: new Date(),
      user: currentUser.email,
      room: Types.ObjectId(roomId),
      body: body,
    });

    const savedMessages = await newMessage.save();
    res.status(201).json({ message: savedMessages });
  } catch (err) {
    console.log("Error creating message");
    res.status(500).json({ error: "Internal server Error " + err });
  }
}

//Update a message within a room
async function updateRoomMessage(req, res) {
  try {
    const messageId = req.params.messageId;
    const newBody = req.body.body;
    const userId = req.userId;
    const isAdmin = req.isAdmin;

    // retrieve the User using it's id
    const currentUser = await User.findById(userId);
    if (currentUser === null) {
      res.status(403).json({ error: "User does not exist." });
      return;
    }

    // check if the message exist
    // messageToUpdate is a MessageModel if it's not null
    const messageToUpdate = await Message.findById(messageId);
    if (messageToUpdate === null) {
      res.status(404).json({ error: "Message not found." });
      return;
    }
    // check that the user is updating their own message
    const isUserOwningMessageOrAdmin = messageToUpdate.user === currentUser.email || isAdmin;
    if (!isUserOwningMessageOrAdmin) {
      res.status(403).json({ error: "User does not have authorization to update this message." });
      return;
    }

    // when all criteria is met, then update message
    messageToUpdate.body = newBody;
    await messageToUpdate.save();
    res.status(200).json({ message: messageToUpdate, status: "Message updated successfully." });
  } catch (error) {
    res.status(500).json({ error });
  }
}

// Delete a message within a room
async function deleteRoomMessage(req, res) {
  try {
    const messageId = req.params.messageId;
    const userId = req.userId;
    const isAdmin = req.isAdmin;
    console.log(isAdmin);

    // retrieve the User using it's id
    const currentUser = await User.findById(userId);
    if (currentUser === null) {
      res.status(403).json({ error: "User does not exist." });
      return;
    }

    // check if the message exist
    // messageToDelete is a MessageModel if it's not null
    const messageToDelete = await Message.findById(messageId);
    if (messageToDelete === null) {
      res.status(404).json({ error: "Message not found." });
      return;
    }
    // check that the user is deleting their own message
    const isUserOwningMessageOrAdmin = messageToDelete.user === currentUser.email || isAdmin;
    if (!isUserOwningMessageOrAdmin) {
      res.status(403).json({ error: "User does not have authorization to delete this message." });
      return;
    }

    // when all criteria is met, then delete message
    await messageToDelete.deleteOne();
    res.status(200).json({ status: "Message deleted successfully." });
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = { updateRoomMessage, deleteRoomMessage, createRoomMessage, getRoomMessages };

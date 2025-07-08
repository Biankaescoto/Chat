const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const { createUser, getRoomUsers, loginUser, updateUserInfo, deleteWholeUser } = require("./userController");
// added updateRoom and deleteRoom
const { createRoom, getRooms, getRoom, updateRoomInfo, deleteRoom, joinRoom } = require("./roomController");
const { updateRoomMessage, deleteRoomMessage, getRoomMessages, createRoomMessage } = require("./messageController");

// this middleware serves to protect our routes, so user requires authentication (to be logged in) in order to create posts etc
function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

async function verifyAdmin(req, res, next) {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(401).json({ error: "Access denied" });
    }
    req.isAdmin = user.isAdmin;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "User not found" });
  }
}

// rooms
router.post("/rooms", verifyToken, createRoom);
router.get("/rooms", verifyToken, getRooms);
router.get("/rooms/:roomId", verifyToken, getRoom);
router.put("/rooms/:roomId", verifyToken, verifyAdmin, updateRoomInfo);
router.delete("/rooms/:roomId", verifyToken, verifyAdmin, deleteRoom);
router.put("/rooms", verifyToken, joinRoom);

// messages
router.get("/messages", verifyToken, getRoomMessages); // to get room messages, use a url param localhost:8080/messages?roomId=65dc0cd0ce6875707e4b9bb3
router.post("/messages", verifyToken, createRoomMessage); // now to create a room in postman, pass roomId through body instead of url
router.put("/messages/:messageId", verifyToken, verifyAdmin, updateRoomMessage);
router.delete("/messages/:messageId", verifyToken, verifyAdmin, deleteRoomMessage);

//users
router.post("/users/signup", createUser);
// added getAllUsers for front end Chatroom
router.get("/users", getRoomUsers);
router.post("/users/login", loginUser);
router.put("/users", verifyToken, updateUserInfo);
router.delete("/users", verifyToken, deleteWholeUser);

module.exports = router;

const Room = require("../models/roomModel");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
function isUndefinedOrEmpty(testValue) {
  return testValue === undefined || testValue === "";
}

function createToken(userId) {
  return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: "30 days" });
}

async function createUser(req, res) {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    if (isUndefinedOrEmpty(firstName) || isUndefinedOrEmpty(lastName) || isUndefinedOrEmpty(email) || isUndefinedOrEmpty(password)) {
      res.status(400).json({ error: "All input fields must be filled to create User." });
      return;
    }
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword });
    const token = createToken(user._id);
    res.status(201).json({ status: "User successfully created.", token, email, firstName: user.firstName, lastName: user.lastName });
  } catch (error) {
    res.status(500).json({ error });
  }
}

// added get all users from one room
async function getRoomUsers(req, res) {
  try {
    const { roomId } = req.query;
    const currentRoom = await Room.findById(roomId);
    if (currentRoom === null) {
      res.status(404).json({ error: "Room not found" });
      return;
    }
    let users = await User.find().where("email").in(currentRoom.addedUsers);
    users = users.filter((user) => user != null);
    users = users.map((user) => {
      const {email, firstName, lastName} = user;
      return {email, firstName, lastName};
    });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found " });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Internal server Error " });
  }
}

async function loginUser(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (isUndefinedOrEmpty(email) || isUndefinedOrEmpty(password)) {
      res.status(400).json({ error: "Provide valid email and password to log in." });
      return;
    }
    const user = await User.findOne({ email }).exec();
    if (user === null) {
      res.status(404).json({ error: "User with these credentials not found." });
      return;
    }
    if (bcrypt.compareSync(password, user.password) === false) {
      res.status(401).json({ error: "Incorrect email and password." });
      return;
    }
    const token = createToken(user._id);
    res.status(200).json({ status: "Login Successful", token, email: user.email, firstName: user.firstName, lastName: user.lastName });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

// update user's information
async function updateUserInfo(req, res) {
  try {
    const userId = req.userId;
    const usersUpdatedInformation = req.body;
    const updatedUser = await User.findById(userId);
    if (updatedUser === null) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    if (usersUpdatedInformation.password !== undefined) {
      const salt = bcrypt.genSaltSync();
      usersUpdatedInformation.password = bcrypt.hashSync(usersUpdatedInformation.password, salt);
    }

    await updatedUser.updateOne(usersUpdatedInformation, { new: true });

    res.status(200).json({
      status: "User information updated successfully",
      email: usersUpdatedInformation.email,
      firstName: usersUpdatedInformation.firstName,
      lastName: usersUpdatedInformation.lastName,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}

// delete user
async function deleteWholeUser(req, res) {
  try {
    const userId = req.userId;
    const deletedUser = await User.findById(userId);
    if (deletedUser === null) {
      res.status(404).json({ error: "User not found." });
      return;
    }
    await deletedUser.delete();
    res.status(200).json({ status: "User Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = { createUser, getRoomUsers, loginUser, updateUserInfo, deleteWholeUser };

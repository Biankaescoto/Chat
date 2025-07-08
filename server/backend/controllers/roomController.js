const Room = require("../models/roomModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

function getRandomRoomImg() {
  const roomImgArray = ["/images/new-room.png", "/images/new-room2.jpg", "/images/new-room3.jpg", "/images/new-room4.jpg"];
  const roomImgIndex = Math.floor(Math.random() * roomImgArray.length);
  return roomImgArray[roomImgIndex];
}

// create new room [POST]
const createRoom = async (req, res) => {
  try {
    // Parse the string of ids into an array
    let addedUsersArray = [];
    const addedUsersString = req.body.addedUsers;
    if (typeof addedUsersString === "string") {
      addedUsersArray = addedUsersString.split(",");
    }
    const userId = req.userId;

    const currentUser = await User.findById(userId);
    if (currentUser === null) {
      res.status(403).json({ error: "User does not exist." });
      return;
    }
    // check if the user creating the room is part of addedUsers
    if (!addedUsersArray.includes(currentUser.email)) {
      addedUsersArray.push(currentUser.email);
    }

    const newRoom = new Room({
      thumbnail: getRandomRoomImg(),
      name: req.body.name,
      description: req.body.description,
      addedUsers: addedUsersArray, // verify that it's an array of emails and that the user creating the room is a part of that array of emails
      owner: currentUser.email,
    });

    await newRoom.save();

    res.status(200).json({ status: "Room created successfully", room: newRoom });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to create room",
    });
  }
};

// Display all rooms [GET]
const getRooms = async (req, res) => {
  try {
    const allRooms = await Room.find();
    res.status(200).json({
      results: allRooms,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch rooms",
    });
  }
};

// get a single room
const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const currentRoom = await Room.findById(roomId);
    if (currentRoom === null) {
      res.status(404).json({ error: "Room not found" });
      return;
    }
    return res.status(200).json({ status: "Room successfully fetched", room: currentRoom });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch room",
    });
  }
};

// Update [POST] a room
const updateRoomInfo = async (req, res) => {
  try {
    const { roomId } = await req.params;
    const roomsUpdatedInformation = req.body;
    const updatedRoom = await Room.findById(roomId);

    if (updatedRoom === null) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    await updatedRoom.update(roomsUpdatedInformation, { new: true });
    res.status(200).json({ status: "Room information updated successfully", room: updatedRoom });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// [Delete]  a room
const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const deletedRoom = await Room.findById(roomId);

    if (deletedRoom === null) {
      res.status(404), json({ error: "Room not found" });
      return;
    }
    await deletedRoom.delete();
    res.status(200).json({ status: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// to join room
async function joinRoom(req, res) {
  try {
    const { roomId } = req.query;
    const room = await Room.findById(roomId);
    if (room === null) {
      res.status(404), json({ error: "Room not found" });
      return;
    }
    const userId = req.userId;
    const currentUser = await User.findById(userId);
    if (currentUser === null) {
      res.status(403).json({ error: "User does not exist." });
      return;
    }
    if (!room.addedUsers.includes(currentUser.email)) {
      room.addedUsers.push(currentUser.email);
      await room.save();
    }
    res.status(200).json({ status: "User Joined Room Successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
}

// added updateRoom and deleteRoom
module.exports = { createRoom, getRooms, getRoom, updateRoomInfo, deleteRoom, joinRoom };

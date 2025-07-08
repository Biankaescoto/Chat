// schema
const mongoose = require("mongoose");
const { Types } = mongoose;

const roomSchema = new mongoose.Schema({
  thumbnail: String,
  name: String,
  description: String,
  addedUsers: [String],
  owner: String,
});

// model stores data from rooms
const Room = mongoose.model("Room", roomSchema);

module.exports = Room;

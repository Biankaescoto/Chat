// schema
const mongoose = require("mongoose");
const { Types } = mongoose;

const messageSchema = new mongoose.Schema({
  when: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: String,
    required: true,
  },
  room: {
    type: Types.ObjectId,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

// model stores data from messages
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;

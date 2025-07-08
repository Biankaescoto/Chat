import React from "react";
// import Avatar component
import Avatar from "boring-avatars";
// import { getRoomMessages } from "../../../../Backend/controllers/messageController"; when this is commented out you csn refresh the page with no issues.
import { getEmail, getFirstName, getLastName, getToken } from "../../localStorage";

const ChatRoomBubble = (props) => {
  const { message, isOwnMessage } = props;
  const { when, user, room, body } = message;
  const { firstName, lastName } = user

  // return jsx for chat bubble based on ownership of message
  return (
    
    <div className={`chat-bubble ${isOwnMessage ? "own-message" : "other-message"}`}>
      <div className="message-wrapper">
      <Avatar className="chat-bubble img" size={60} name={user.firstName} variant="beam" colors={["#001449", "#012677", "#005BC5", "#00B4FC", "#17F9FF"]} />
      <div className="message-content">
        <span className="username"> {isOwnMessage ? "You" :  user} </span>
        <p>{body}</p>
      </div>
    </div>
    </div>
  );
};

// export chatRoomBubble Component
export default ChatRoomBubble;

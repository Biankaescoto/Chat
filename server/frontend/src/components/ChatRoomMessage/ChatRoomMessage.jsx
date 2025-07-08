// Import necessary dependencies and components
import React, { useState, useEffect, useRef } from "react";
import ChatRoomBubble from "../ChatRoomBubble/ChatRoomBubble";
import ChatRoomUser from "../ChatRoomUser/ChatRoomUser";
import { getEmail, getFirstName, getLastName, getToken } from "../../localStorage";

// ChatRoomMessage component
export default function ChatRoomMessage(props) {
  const { roomId, messages, roomInformation, onMessageSent } = props;
  const [inputMessage, setInputMessage] = useState("");
  const [showExitButton, setShowExitButton] = useState(true);
  // Ref for scrolling to the bottom of the message container
  const messageContainerRef = useRef();
  useEffect(() => {
    scrollToBottom();
  }, []);

  // function to scroll to the bottom of the message container
  const scrollToBottom = () => {
    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  };

  // Event handle for input change
  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleSubmitMessage = async (event) => {
    event.preventDefault();

    // Check if the inputMessage is not empty
    if (inputMessage.trim() === "") {
      return;
    }

    console.log(roomId);

    try {
      const response = await fetch(`http://localhost:8080/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
        body: JSON.stringify({
          body: inputMessage,
          roomId,
        }),
      });

      if (response.status === 200) {
        console.log("Message sent successfully");
      } else {
        console.error("Failed to send message:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setInputMessage("");
    onMessageSent();
  };

  // event handler for clicking the exit button
  const handleExitButtonClick = async () => {
    try {
      const response = await fetch(`http://localhost:8080/messages?roomId=${roomId}/exit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({}),
      });

      if (response.ok) {
        setShowExitButton(false);
      } else {
        console.error("Failed to exit chat room:", response.statusText);
      }
    } catch (error) {
      console.error("Error exiting chat room:", error);
    }
  };

// TODO- function to render message bubble for each person (trying)
const renderMessageBubble = (message) => {
  // extract message details 
  const { _id, user, body } = message;

  // check if the message is from current user 
  const isCurrentUser = user.email ===getEmail();

  // determine username to display 
  const username = isCurrentUser? "You": `${user.firstName} ${user.lastName}`;

  return (
    <div className="chat-room-bubble-for-chat-room-message">
    <ChatRoomBubble
    key={message._id}
    message={message}
    isOwnMessage={isCurrentUser}
    username={username}
    />
    </div>
  )
};


  return (
    <div className="chat-room-messages">
      {/* <button className="exit-button" onClick={handleExitButtonClick}>
        ❌
      </button> */}

      <div className="messages-container" ref={messageContainerRef}>
        <h2 className="room-name-heading"> {roomInformation.name ?? ""} </h2>
        <h2 className="room-description"> {roomInformation.description ?? ""} </h2>
      </div>

{/* TODO Render message bubbles for each   */}
        <div className="chat-room-bubble-for-chat-room-message">
          {messages.map(renderMessageBubble)}

        </div>
{/* 
      <div className="chat-room-bubble-for-chat-room-message">
        {messages.map((message) => (
          <ChatRoomBubble 
          key={message._id} 
          message={message} 
          isOwnMessage={message.user === getEmail()} />
        ))}
      </div> */}

      <div className="users-container">
        <div>
          <form className="input-container" onSubmit={handleSubmitMessage}>
            <input type="text" value={inputMessage} onChange={handleInputChange} placeholder="Type your message here..." />
            <button className="message-button" type="submit">
              {" "}
              Send{" "}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// in lobby you can get request for room ids and endpoints.
// room tiles- add room id-make a request to get messages for specific room.
// for retrieving messages
// first component makes a get request to room end points to get all rooms available, once they click on room endpoint you get a room Id, then you create end point for room:id and retrieve your messages.

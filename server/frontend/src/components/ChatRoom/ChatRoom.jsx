import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import ChatRoomMessage from "../ChatRoomMessage/ChatRoomMessage";
import ChatRoomUser from "../ChatRoomUser/ChatRoomUser";
import { getEmail, getToken, isLoggedIn } from "../../localStorage";
import { Navigate, useParams } from "react-router-dom";
import ChatRoomBubble from "../ChatRoomBubble/ChatRoomBubble";

// main component for chatRoom page
export default function ChatRoom() {
  // state variables
  const [showMessages, setShowMessages] = useState(true);
  const { roomId } = useParams();
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [roomInformation, setRoomInformation] = useState({});
  const handleMessagesClick = () => {
    setShowMessages(true);
    setShowUsers(false);
  };

  const handleUsersClick = () => {
    setShowMessages(false);
    setShowUsers(true);
  };

  //  fetched list of users in current room
  function getUsers() {
    fetch(`http://localhost:8080/users?roomId=${roomId}`, { headers: { Authorization: getToken() } })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        console.log(data);
      })

      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("fetch aborted");
        } else {
          console.error("Error fetching messages", error);
        }
      });
  }


  // fetched list of messages for current room
  const getMessages = async () => {
    try {
      const response = await fetch(`http://localhost:8080/messages?roomId=${roomId}`, {
        headers: {
          Authorization: getToken(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setMessages(data);
        console.log("Fetched messages:", data);
      } else {
        console.error("Failed to fetch messages:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  function getRoomInformation() {
    fetch(`http://localhost:8080/rooms/${roomId}`, { headers: { Authorization: getToken() } })
      .then((response) => response.json())
      .then((data) => {
        setRoomInformation(data.room);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }

  // hook to fetch data when the component  mounts or when the roomId or showMessages state changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUsers();
        await getMessages();
        await getRoomInformation();
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, [roomId, showMessages]);

  // Render the component content based on user 
  return !isLoggedIn() ? (
    <Navigate to="/" replace />
  ) : (
    <div className="chat-room-page">
      <Navbar />
      <div className="chat-room">
        <div className="chat-room-options">
          <button onClick={handleMessagesClick}> Messages </button>
          <button onClick={handleUsersClick}> Users </button>
        </div>

        {showMessages && <ChatRoomMessage roomId={roomId} roomInformation={roomInformation} messages={messages} onMessageSent={getMessages} />}

        {showUsers && <ChatRoomUser users={users} />}
      </div>
    </div>
  );
}



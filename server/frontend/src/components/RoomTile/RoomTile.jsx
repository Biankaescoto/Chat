// import dependencies
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../localStorage";
// component for the room tile
export default function RoomTile(props) {
  // state variables to manage the visibility
  const [isOpen, setIsOpen] = useState(false);
  // hook for navigation
  const nav = useNavigate();
  // props
  const { src, onUpdate, onDelete, isOwner, isRoomMember, roomId, name, description } = props;
  // function to join the room
  async function joinRoom() {
    // check if the user is already a member of the room
    if (isRoomMember) {
      // redirect to the chatroom
      nav(`/chatroom/${roomId}`);
      return;
    }

    // make a request to join the chatRoom
    const response = await fetch(`http://localhost:8080/rooms?roomId=${roomId}`, {
      method: "PUT",
      headers: {
        Authorization: getToken(),
      },
    });
    const responseData = await response.json();
    if (response.status !== 200) {
      console.error(responseData.error);
      // error
      return;
    }
    // redirect to chatroom
    nav(`/chatroom/${roomId}`);
  }
  return (
    // room tile container
    <div className="component_room-tile">
      <div className="my-chat-room-settings-btn-container">
        {isOwner && <button onClick={() => setIsOpen(!isOpen)} className="my-chat-room-settings-btn">
          <i className="fa-solid fa-ellipsis"></i>
        </button>}
      </div>
      <h4 className="room-tile-name">{name}</h4>
      <img className="room-tile-img" src={src} />
      <button onClick={joinRoom} className="room-action-btn">{isRoomMember ? "Enter" : "Join"}</button>
      {isOpen && (
        <div className="my-chat-room-menu">
          <button className="my-chat-room-update-btn" onClick={()=> onUpdate(roomId, name, description)}>Update</button>
          <button className="my-chat-room-delete-btn" onClick={()=> onDelete(roomId)}>Delete</button>
        </div>
      )}
    </div>
  );
}

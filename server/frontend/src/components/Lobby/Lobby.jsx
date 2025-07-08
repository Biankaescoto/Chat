// Import necessary dependencies and components
import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import RoomTile from "../RoomTile/RoomTile";
import Slider from "react-slick";
import CreateRoomPopup from "../CreateRoomPopup/CreateRoomPopup";
import { getEmail, getToken, isLoggedIn } from "../../localStorage";
import { Navigate, useNavigate } from "react-router-dom";
import UpdateRoomPopup from "../UpdateRoomPopup/UpdateRoomPopup";
import DeleteRoomPopup from "../DeleteRoomPopup/DeleteRoomPopup";

// Enum for different types of popups
const PopupEnum = {
  none: -1,
  createRoom: 0,
  updateRoom: 1,
  deleteRoom: 2,
};

export default function Lobby() {
  // state variables
  const [commonRooms, setCommonRooms] = useState([]);
  const [myChatRooms, setMyChatRooms] = useState([]);
  const [roomInformation, setRoomInformation] = useState({});
  
  // settings for the Slider component
  const commonRoomsSettings = {
    dots: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    infinite: true,

    responsive: [
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const myChatRoomsSettings = {
    dots: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    infinite: myChatRooms.length >= 3,

    responsive: [
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: myChatRooms.length >= 2,
        },
      },
    ],
  };
  // close and open create room popup
  const [opennedPopup, setOpennedPopup] = useState(PopupEnum.none);

  // hook for nav
  const nav = useNavigate();

  // function to fetch rooms from the server
  async function getRooms() {
    const response = await fetch("http://localhost:8080/rooms", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
    });
    const responseData = await response.json();
    if (response.status !== 200) {
      console.error(responseData.error);
      // error
      return;
    }
    setCommonRooms(responseData.results.filter((room) => room.owner != getEmail()));
    setMyChatRooms(responseData.results.filter((room) => room.owner === getEmail()));
  }

  // update room fun
  async function updateRoom(roomId, name, description) {
    setRoomInformation({ roomId, name, description });
    setOpennedPopup(PopupEnum.updateRoom);
  }

  // delete room func
  function deleteRoom(roomId) {
    setRoomInformation({ roomId });
    setOpennedPopup(PopupEnum.deleteRoom);
  }

  useEffect(() => {
    getRooms();
  }, []);

  // function to open the create room popup
  function openCreateRoomPopup() {
    setOpennedPopup(PopupEnum.createRoom);
  }

  // close any open popup
  function closePopup() {
    setOpennedPopup(PopupEnum.none);
  }

  // redirect user to login page is user is not logged in
  if (isLoggedIn() === false) {
    nav("/");
  }

  // Render the Lobby page based on user login status
  return !isLoggedIn() ? (
    <Navigate to="/" replace />
  ) : (
    <main className="lobby">
      <Navbar />
      <div className="create-room-btn-container">
        <button onClick={openCreateRoomPopup} className="create-room-btn">
          Create Room <i className="fa-solid fa-couch"></i>
        </button>
      </div>
      <h1 className="common-rooms-heading">
        Common Rooms <i className="fa-solid fa-people-line"></i>
      </h1>
      <div className="room-tile-container">
        <Slider {...commonRoomsSettings} className="common-room-tiles">
          {commonRooms.map((room) => (
            <RoomTile
              onUpdate={updateRoom}
              onDelete={deleteRoom}
              key={room._id}
              isOwner={false}
              isRoomMember={room.addedUsers.includes(getEmail())}
              src={room.thumbnail}
              roomId={room._id}
              name={room.name}
              description={room.description}
            />
          ))}
        </Slider>
        <h2 className="my-chat-rooms-heading">
          My Chat Rooms <i className="fa-solid fa-people-roof"></i>
        </h2>
        <Slider {...myChatRoomsSettings} className="my-room-tiles">
          {myChatRooms.map((room) => (
            <RoomTile
              key={room._id}
              onUpdate={updateRoom}
              onDelete={deleteRoom}
              isOwner={true}
              isRoomMember={true}
              src={room.thumbnail}
              roomId={room._id}
              name={room.name}
              description={room.description}
            />
          ))}
        </Slider>
        <div className="create-room-btn-container"></div>
      </div>
      {opennedPopup === PopupEnum.createRoom && <CreateRoomPopup onClose={closePopup} onRoomCreated={getRooms} />}
      {opennedPopup === PopupEnum.updateRoom && (
        <UpdateRoomPopup
          roomId={roomInformation.roomId}
          name={roomInformation.name}
          description={roomInformation.description}
          onClose={closePopup}
          onRoomUpdated={getRooms}
        />
      )}
      {opennedPopup === PopupEnum.deleteRoom && <DeleteRoomPopup onClose={closePopup} onRoomDeleted={getRooms} roomId={roomInformation.roomId} />}
    </main>
  );
}

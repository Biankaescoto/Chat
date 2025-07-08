// import dependencies and components
import { useState } from "react";
import Popup from "../Popup/Popup";
import { getToken } from "../../localStorage";

// component for creating a new chat room
export default function CreateRoomPopup(props) {
  // state to for input values
  const [inputs, setInputs] = useState({});
  // props to access onClose and onRoomCreated functions
  const { onClose, onRoomCreated } = props;

  // event handler for handling input change
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // handles room creation
  async function onCreateRoom(event) {
    event.preventDefault();

    // POST request to create a new room
    const response = await fetch("http://localhost:8080/rooms", {
      method: "POST",
      body: JSON.stringify(inputs),
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
    // updates the onRoomCreated and onClose functions tp update the UI
    onRoomCreated();
    onClose();
  }

  // Render the createRoomPopUp component
  return (
    <Popup onClose={onClose}>
      <form onSubmit={onCreateRoom} className="create-room-form">
        <input className="room-name-input" required={true} name="name" value={inputs.name} onChange={handleChange} placeholder="Room Name..." />
        <textarea
          className="room-description-input"
          required={true}
          name="description"
          value={inputs.description}
          onChange={handleChange}
          placeholder="Description..."
        ></textarea>
        <button className="create-room-btn">Create Room</button>
      </form>
    </Popup>
  );
}

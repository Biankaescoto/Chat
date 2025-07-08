// Import dependencies
import { useState } from "react";
import Popup from "../Popup/Popup";
import { getToken } from "../../localStorage";

// component for updating room popup
export default function UpdateRoomPopup(props) {
  //  props
  const { onClose, onRoomUpdated, roomId, name, description } = props;
  // state  variables
  const [inputs, setInputs] = useState({
    name,
    description,
  });
  // event handler for input change
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
// function to update room
  async function onUpdateRoom(event) {
    event.preventDefault();
    const response = await fetch(`http://localhost:8080/rooms/${roomId}`, {
      method: "PUT",
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
    // onRoomUpdated callback
    onRoomUpdated();
    // close the popup
    onClose();
  }

  return (
    // Popup component
    <Popup onClose={onClose}>
      <form onSubmit={onUpdateRoom} className="update-room-form">
        <input className="update-name-input" required={true} name="name" value={inputs.name} onChange={handleChange} placeholder="Room Name..." />
        <textarea
          className="room-description-input"
          required={true}
          name="description"
          value={inputs.description}
          onChange={handleChange}
          placeholder="Description..."
        ></textarea>
        <button className="update-room-btn">Update Room</button>
      </form>
    </Popup>
  );
}

// Import necessary dependencies and components 
import { getToken } from "../../localStorage";
import Popup from "../Popup/Popup";

// component for rendering the delete room confirmation popup
export default function DeleteRoomPopup(props) {
  // props to access onClose, onRoomDeleted, and roomId
    const {onClose, onRoomDeleted, roomId} = props;

    // function to handle room deletion
  async function deleteRoom() {
    // DELETE request to delete the specified room
    const response = await fetch(`http://localhost:8080/rooms/${roomId}`, {
      method: "DELETE",
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
    onRoomDeleted();
    onClose();
  }

  // Render the DeleteRoomPopup component
  return (
    <Popup onClose={onClose}>
      <p className="delete-room-popup-msg"> Are You Sure You Want To Delete Your Room?</p>
      <div className="delete-room-popup-btns">
        <button onClick={deleteRoom} className="delete-room-yes-btn">
          Yes
        </button>
        <button onClick={onClose} className="delete-room-cancel-btn">
          Cancel
        </button>
      </div>
    </Popup>
  );
}

// import component
import Popup from "../Popup/Popup";
// component for rendering a delete user
export default function DeleteUserPopup(props) {
  // props to access onConfirmDelete and onClose functions
  const { onConfirmDelete, onClose } = props;

  // Render the DeleteUserPopup component
  return (
    <Popup onClose={onClose}>
      <p> Are You Sure You Want To Delete Your Account?</p>
      <div className="delete-user-popup-btns">
        <button onClick={onConfirmDelete} className="delete-user-yes-btn">
          Yes
        </button>
        <button onClick={onClose} className="delete-user-cancel-btn">
          Cancel
        </button>
      </div>
    </Popup>
  );
}

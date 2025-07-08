
// component for a popup 
export default function Popup(props) {
  // destructure props to extract children and onClose function
  const { children, onClose } = props;
  return (
    // Popup container
    <div className="popup">
      <div className="popup-content">
        <button onClick={onClose} className="popup-close-btn">
          <i class="fa-solid fa-xmark"></i>
        </button>
        {children}
      </div>
    </div>
  );
}

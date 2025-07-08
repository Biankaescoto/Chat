// Import Avatar
import Avatar from "boring-avatars";
import { getEmail, getFirstName, getLastName, getToken } from "../../localStorage";


// ChatRoomUser component for rendering list of users
export default function ChatRoomUser(props) {
  // users prop
  const { users } = props;
  

  return (
    <div className="users-popup">
      <ul className="users-list">
        {/* map through list of users and render their info */}
        {users.map((user) => (
          // use email as the key for the user
          <li key={user.email} className="user-item">
            {/* render avatar component */}
            <Avatar size={60} name={user.firstName} variant="beam" colors={["#001449", "#012677", "#005BC5", "#00B4FC", "#17F9FF"]} />
            {/* display users full name */}
            <div className="user-info">
              <span className="user-name">{`${user.firstName} ${user.lastName}`}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

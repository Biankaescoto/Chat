// importing dependencies
import  Avatar  from "boring-avatars";
import { NavLink } from "react-router-dom";
import { getEmail, getFirstName, getLastName} from "../../localStorage";

// component for the navigation bar
export default function Navbar() {
  // get users first and last name to display in navbar
  const username = `${getFirstName()} ${getLastName()}`;
  return (
    <div className="component_navbar">
      <nav className="lobby-navbar">
        <div className="logo-link-container">
          <img className="navbar-logo" src="/images/bite_back_chat_.jpg" />
          <NavLink to="/lobby" className="navbar-lobby-link">Lobby</NavLink>
        </div>
        <div className="username-profile-container">
          <Avatar size={60} name={getEmail()} variant="beam" colors={["#001449", "#012677", "#005BC5", "#00B4FC", "#17F9FF"]} />
          {/* <img className="usersProfileImg" src="/images/placeholderPFP.JPG" /> */}
          <p className="usersName">{username}</p>
        </div>
        <div className="lobby-settings-btn-container">
          <NavLink className="lobby-settings-btn" to="/settings">
            <i className="fa-solid fa-bars"></i>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}

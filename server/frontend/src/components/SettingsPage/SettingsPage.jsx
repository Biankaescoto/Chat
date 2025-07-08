// import dependencies
import { useState } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { isLoggedIn, getFirstName, getLastName, getEmail, getToken, setEmail, setFirstName, setLastName, clearStorage } from "../../localStorage";
import DeleteUserPopup from "../DeleteUserPopup/DeleteUserPopup";

// component for the settings page
export default function SettingsPage() {
  // state variables
  const [isDeleteUserPopupOpen, setIsDeleteUserPopupOpen] = useState(false);
  const [currentStatusMessage, setCurrentStatusMessage] = useState(null);
  const [currentErrorMessage, setCurrentErrorMessage] = useState(null);
  const [inputs, setInputs] = useState({
    lastName: getLastName(),
    firstName: getFirstName(),
    email: getEmail(),
  });
  // hook for nav
  const nav = useNavigate();
  // event handler for input change
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // function to update user information
  const onUpddate = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:8080/users", {
      method: "PUT",
      body: JSON.stringify(inputs),
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
    });

    const responseData = await response.json();
    if (response.status !== 200) {
      setCurrentErrorMessage(responseData.error);
      setCurrentStatusMessage(null);
      // error
      return;
    }

    //success
    setEmail(responseData.email);
    setFirstName(responseData.firstName);
    setLastName(responseData.lastName);
    setCurrentErrorMessage(null);
    setCurrentStatusMessage(responseData.status);
  };

  // Function to delete user account
  const onDelete = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:8080/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
    });

    const responseData = await response.json();
    if (response.status !== 200) {
      setCurrentErrorMessage(responseData.error);
      setCurrentStatusMessage(null);
      // error
      return;
    }

    //success
    console.table(responseData);
    clearStorage();
    nav("/");
  };


  return !isLoggedIn() ? (
    // redirect if not logged in
    <Navigate to="/" replace />
  ) : (
    <main className="settings-page">
      <div className="settings-popup">
        <div className="settings-content">
          <div className="settings-close-btn-container">
            <NavLink className="settings-close-btn" to={-1}>
              <i className="fa-solid fa-xmark"></i>
            </NavLink>
          </div>
          <h1 className="settings-header">Edit User Info</h1>
          {currentErrorMessage && <h2 className="error-notif">{currentErrorMessage}</h2>}
          {currentStatusMessage && <h2 className="status-notif">{currentStatusMessage}</h2>}
          <form onSubmit={onUpddate} className="settings-form">
            <input
              className="first-name-input"
              required={true}
              name="firstName"
              placeholder="First Name"
              value={inputs.firstName}
              onChange={handleChange}
            />
            <input
              className="last-name-input"
              required={true}
              name="lastName"
              placeholder="Last Name"
              value={inputs.lastName}
              onChange={handleChange}
            />
            <input className="email-input" required={true} name="email" placeholder="Email" value={inputs.email} onChange={handleChange} />
            <input
              className="password-input"
              required={true}
              name="password"
              placeholder="Password"
              value={inputs.password}
              onChange={handleChange}
            />
            <button className="settings-update-btn">Update</button>
          </form>
          <div className="logout-delete-btn-container">
            <button onClick={() => nav("/logout")} className="settings-logout-btn">
              Log Out
            </button>
            <button onClick={()=> setIsDeleteUserPopupOpen(true)} className="settings-delete-btn">Delete My Account 😿</button>
          </div>
        </div>
      </div>
      {isDeleteUserPopupOpen && <DeleteUserPopup onConfirmDelete={onDelete} onClose={()=> setIsDeleteUserPopupOpen(false)} />}
    </main>
  );
}

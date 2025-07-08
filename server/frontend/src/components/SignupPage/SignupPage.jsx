// Import dependencies
import { useState } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { isLoggedIn, setEmail, setFirstName, setLastName, setToken } from "../../localStorage";

// component for the signup page
export default function SignupPage() {
  // state variables
  const [inputs, setInputs] = useState({});
  const [currentStatusMessage, setCurrentStatusMessage] = useState(null);

  // Hook for navigation
  const nav = useNavigate();

  // event handlers for handling input change 
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Function to handle form submission
  const onSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:8080/users/signup", {
      method: "POST",
      body: JSON.stringify(inputs),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    if (response.status !== 201) {
      setCurrentStatusMessage(responseData.error);
      // error
      return;
    }

    //success
    setEmail(responseData.email);
    setToken(responseData.token);
    setFirstName(responseData.firstName);
    setLastName(responseData.lastName);
    nav("/lobby");
  };

  return isLoggedIn() ? (
    // redirect to lobby 
    <Navigate to="/lobby" replace />
  ) : (
    <main className="signup-page">
      <div className="sign-up-popup">
        <div className="sign-up-content">
          <img className="signup-logo" src="/images/bite_back_chat_.jpg" />
          <h1 className="signup-header">Sign Up</h1>
          {currentStatusMessage && <h2 className="status-notif">{currentStatusMessage}</h2>}
          <form className="signup-form" onSubmit={onSubmit}>
            <input
              className="first-name-input"
              required={true}
              name="firstName"
              placeholder="First Name"
              value={inputs.firstName || ""}
              onChange={handleChange}
            />
            <input
              className="last-name-input"
              required={true}
              name="lastName"
              placeholder="Last Name"
              value={inputs.lastName || ""}
              onChange={handleChange}
            />
            <input className="email-input" required={true} name="email" placeholder="Email" value={inputs.email || ""} onChange={handleChange} />
            <input
              className="password-input"
              required={true}
              type="password"
              name="password"
              placeholder="Password"
              value={inputs.password || ""}
              onChange={handleChange}
            />
            <button className="signup-btn">Sign Up</button>
          </form>
          <div className="login-link-container">
            <p className="login-message">Have an account?</p>
            <NavLink className="login-link" to="/">
              Login Here
            </NavLink>
          </div>
        </div>
      </div>
    </main>
  );
}

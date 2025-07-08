// Import dependencies and components
import { useState } from "react";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import { isLoggedIn, setEmail, setFirstName, setLastName, setToken} from "../../localStorage";

// component for Login page
export default function LoginPage() {
  // state variables
  const [inputs, setInputs] = useState({});
  const [currentStatusMessage, setCurrentStatusMessage] = useState(null);

  // hook for navigation
  const nav = useNavigate();

  // Event handler for handling input changes
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // function to handle form submission
  const onSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:8080/users/login", {
      method: "POST",
      body: JSON.stringify(inputs),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    if (response.status !== 200) {
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
    <Navigate to="/lobby" replace />
  ) : (
    <main className="login-page">
      <div className="login-popup">
        <div className="login-content">
          <img className="login-logo" src="/images/bite_back_chat_.jpg" />
          <h1 className="login-header">LOGIN</h1>
          {currentStatusMessage && <h2 className="status-notif">{currentStatusMessage}</h2>}
          <form onSubmit={onSubmit} className="login-form">
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
            <button className="login-btn">Login</button>
          </form>
          <div className="signup-link-container">
            <p className="signup-message">{"Don't have an account?"}</p>
            <NavLink className="signup-link" to="/signup">
              Signup Here
            </NavLink>
          </div>
        </div>
      </div>
    </main>
  );
}

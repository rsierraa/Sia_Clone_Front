import React, { useState, useEffect } from "react";
import "./styles.css";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";
import NotesDashboard from "./NotesDashboard";

export default function App() {
  const [type, setType] = useState("signIn");
  const [user, setUser] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    if (userId && userName) {
      setUser({ userId, name: userName });
    }
  }, []);

  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // If user is logged in, show dashboard
  if (user) {
    return (
      <div className="App">
        <NotesDashboard user={user} onLogout={handleLogout} />
      </div>
    );
  }

  // Otherwise show login/register forms
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="App">
      <h2>Sign in/up Form</h2>
      <div className={containerClass} id="container">
        <SignUpForm onRegisterSuccess={handleRegisterSuccess} />
        <SignInForm onLoginSuccess={handleLoginSuccess} />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                className="ghost "
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

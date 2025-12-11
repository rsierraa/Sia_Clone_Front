import React from "react";
import API_BASE_URL from "./config";

function SignUpForm({ onRegisterSuccess }) {
  const [state, setState] = React.useState({
    name: "",
    user: "",
    password: ""
  });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = async evt => {
    evt.preventDefault();
    setError("");
    setLoading(true);

    const { name, user, password } = state;

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user, password, name })
      });

      if (response.status === 201) {
        const data = await response.json();
        // Store user data in localStorage
        localStorage.setItem('userId', data.id);
        localStorage.setItem('userName', user);
        // Call parent callback with user data
        if (onRegisterSuccess) {
          onRegisterSuccess({ userId: data.id, name: user });
        }
      } else if (response.status === 409) {
        const data = await response.json();
        setError(data.error || "Usuario ya existente");
      } else {
        setError("Error en el registro");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        <div className="social-container">
          <a href="#" className="social">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in" />
          </a>
        </div>
        <span>or use your email for registration</span>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="text"
          name="user"
          value={state.user}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;

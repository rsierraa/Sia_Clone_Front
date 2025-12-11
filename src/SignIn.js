import React from "react";
import API_BASE_URL from "./config";

function SignInForm({ onLoginSuccess }) {
  const [state, setState] = React.useState({
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

    const { user, password } = state;

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user, password })
      });

      if (response.status === 200) {
        const data = await response.json();
        // Store user data in localStorage
        localStorage.setItem('userId', data.id);
        localStorage.setItem('userName', user);
        // Call parent callback with user data
        if (onLoginSuccess) {
          onLoginSuccess({ userId: data.id, name: user });
        }
      } else if (response.status === 400) {
        const data = await response.json();
        setError(data.error || "Usuario o contraseña incorrectos");
      } else {
        setError("Error en el inicio de sesión");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>
        <span>or use your account</span>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="text"
          placeholder="Username"
          name="user"
          value={state.user}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
          required
        />
        <a href="#">Forgot your password?</a>
        <button disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default SignInForm;

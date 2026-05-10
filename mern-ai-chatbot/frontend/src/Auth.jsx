import { useState } from "react";
import axios from "axios";
import "./Auth.css";


export default function Auth({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const url =
        mode === "signup"
          ? "http://localhost:5000/api/auth/signup"
          : "http://localhost:5000/api/auth/login";

      const res = await axios.post(url, { email, password });

      const token = res.data.token;
      if (!token) throw new Error("No token returned");

      localStorage.setItem("token", token);
      onAuth?.(token);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title">{mode === "login" ? "Login" : "Sign Up"}</h1>

        <div className="auth-toggle">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button className="auth-submit" onClick={submit} disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
        </button>
      </div>
    </div>
  );
}


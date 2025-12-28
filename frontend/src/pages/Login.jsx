import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("VIEWER");
  const [form, setForm] = useState({});

  const submit = async () => {
    const url =
      mode === "login"
        ? "http://localhost:5000/auth/login"
        : "http://localhost:5000/auth/register";

    const body =
      mode === "login" ? form : { ...form, role };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      alert("Authentication failed");
      return;
    }

    const data = await res.json();

    if (mode === "login") {
      // ✅ THIS IS THE KEY FIX
      login(data.token, data.role);

      if (data.role === "ADMIN") navigate("/admin");
      else if (data.role === "SELLER") navigate("/seller");
      else navigate("/");
    } else {
      alert("Registered successfully. Please login.");
      setMode("login");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{mode === "login" ? "Login" : "Register"}</h2>

        {mode === "register" && (
          <>
            <label>Full Name</label>
            <input
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <label>Register as</label>
            <select onChange={e => setRole(e.target.value)}>
              <option value="VIEWER">Viewer</option>
              <option value="SELLER">Seller</option>
            </select>
          </>
        )}

        <label>Email</label>
        <input
          onChange={e =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <label>Password</label>
        <input
          type="password"
          onChange={e =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button onClick={submit}>
          {mode === "login" ? "Login" : "Register"}
        </button>

        {mode === "login" ? (
          <p className="auth-link">
            New user?{" "}
            <span onClick={() => setMode("register")}>
              Register here!
            </span>
          </p>
        ) : (
          <p className="auth-link">
            Already have an account?{" "}
            <span onClick={() => setMode("login")}>
              Login
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

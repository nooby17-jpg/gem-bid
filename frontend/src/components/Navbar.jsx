import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const { theme, setTheme } = useContext(ThemeContext);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <img src="/AgoraTenders.png" alt="logo" width="30" />
        <div className="brand-text">
          <span className="brand-title">Agorá Tenders</span>
          <span className="brand-tagline">
            Marketplace of Indian Public Tenders
          </span>
        </div>
      </Link>

      <nav className="nav-links">
        <Link to="/">Bids</Link>
        <Link to="/compare">Compare</Link>
        <Link to="/login">Login</Link>
        <button onClick={toggleTheme}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </nav>
    </header>
  );
}

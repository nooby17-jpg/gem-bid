import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2>Public Bid Intelligence</h2>
      <div>
        <Link style={styles.link} to="/">View Bids</Link>
        <Link style={styles.link} to="/upload">Upload Snapshot</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    borderBottom: "1px solid #333"
  },
  link: {
    marginLeft: 15,
    textDecoration: "none",
    color: "inherit"
  }
};

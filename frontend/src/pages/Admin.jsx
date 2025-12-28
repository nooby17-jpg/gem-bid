import { useEffect, useState } from "react";

export default function Admin() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/admin/stats", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <p style={{ padding: 40 }}>Loading admin data...</p>;

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h3>Total Users</h3>
          <p>{stats.users}</p>
        </div>
        <div className="card">
          <h3>Total Bids</h3>
          <p>{stats.bids}</p>
        </div>
      </div>

      <p style={{ marginTop: 40, opacity: 0.7 }}>
        Bulk upload & management coming next.
      </p>
    </div>
  );
}

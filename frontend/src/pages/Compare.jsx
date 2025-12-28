import { useEffect, useState } from "react";

export default function Compare() {
  const [bids, setBids] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/compare", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setBids);
  }, []);

  return (
    <div className="container">
      <h2>Comparison</h2>
      {bids.map(b => (
        <div key={b.id}>
          {b.bid_no} — {b.item_title}
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Bids() {
  const [bids, setBids] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/bids")
      .then(r => r.json())
      .then(setBids);
  }, []);

  return (
    <div className="container">
      {bids.map(b => (
        <div className="card" key={b.id}>
          <h3>{b.item_title}</h3>
          <p><b>Bid:</b> {b.bid_no}</p>
          <p><b>Dept:</b> {b.department_name}</p>
          <p>{b.start_date} → {b.end_date}</p>

          <Link to={`/bid/${b.id}`}>View Details</Link>{" "}
          <a href={b.gem_url} target="_blank">Go to GeM</a>

          {token && (
            <button
              onClick={() =>
                fetch("http://localhost:5000/api/compare/add", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({ bidId: b.id })
                })
              }
            >
              Compare
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

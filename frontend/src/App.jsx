import { useEffect, useState } from "react";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
  "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha",
  "Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh",
  "Uttarakhand","West Bengal"
];

export default function App() {
  const [status, setStatus] = useState(null);
  const [bids, setBids] = useState([]);
  const [selected, setSelected] = useState([]);
  const [comparison, setComparison] = useState([]);
  const [stateSearch, setStateSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/status")
      .then(r => r.json())
      .then(setStatus);

    fetchBids();
  }, []);

  const fetchBids = () => {
    fetch(`http://localhost:5000/api/bids?category=${category}`)
      .then(r => r.json())
      .then(setBids);
  };

  const toggle = bidNo => {
    setSelected(prev =>
      prev.includes(bidNo)
        ? prev.filter(x => x !== bidNo)
        : [...prev, bidNo]
    );
  };

  const compare = () => {
    fetch("http://localhost:5000/api/bids/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bidNos: selected })
    })
      .then(r => r.json())
      .then(setComparison);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>GeM Desktop Bid Availability</h1>

      {status && (
        <>
          <p>Bids Available: {status.available ? "YES" : "NO"}</p>
          <p>Total: {status.totalBids}</p>
        </>
      )}

      <hr />

      <input
        placeholder="Search State (for your reference)"
        value={stateSearch}
        onChange={e => setStateSearch(e.target.value)}
      />

      <select onChange={e => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Desktop">Desktop Computer</option>
      </select>

      <button onClick={fetchBids}>Apply Filters</button>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Select</th>
            <th>Bid No</th>
            <th>Buyer</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bids.map(b => (
            <tr key={b.bid_no}>
              <td>
                <input type="checkbox" onChange={() => toggle(b.bid_no)} />
              </td>
              <td>{b.bid_no}</td>
              <td>{b.buyer}</td>
              <td>₹{b.unit_price}</td>
              <td>
                <a href={b.bid_url} target="_blank">Go to GeM</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button disabled={selected.length < 2} onClick={compare}>
        Compare (L1)
      </button>

      {comparison.length > 0 && (
        <>
          <h2>L1 Result</h2>
          {comparison.map(b => (
            <p key={b.bid_no} style={{ color: b.l1 ? "green" : "" }}>
              {b.bid_no} – ₹{b.unit_price} {b.l1 ? "(L1)" : ""}
            </p>
          ))}
        </>
      )}

      <br />
      <a href="http://localhost:5000/api/bids/excel">
        Download L1 Excel
      </a>
    </div>
  );
}

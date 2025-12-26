import { useEffect, useState } from "react";

export default function Viewer() {
  const [bids, setBids] = useState([]);
  const [q, setQ] = useState("");
  const [source, setSource] = useState("ALL");
  const [state, setState] = useState("ALL");
  const [compare, setCompare] = useState([]);

  const load = async () => {
    const params = new URLSearchParams({ q, source, state });
    const data = await fetch(
      `http://localhost:5000/api/bids?${params}`
    ).then(r => r.json());
    setBids(data);
  };

  useEffect(() => { load(); }, [q, source, state]);

  const toggleCompare = bid => {
    setCompare(c =>
      c.find(b => b.bid_id === bid.bid_id)
        ? c.filter(b => b.bid_id !== bid.bid_id)
        : [...c, bid]
    );
  };

  return (
    <div className="container">
      <h2>Indian Tender Listings</h2>

      <div className="filters">
        <input placeholder="Search…" onChange={e=>setQ(e.target.value)} />
        <select onChange={e=>setSource(e.target.value)}>
          <option value="ALL">All Sources</option>
          <option value="CPPP">CPPP</option>
          <option value="GEM">GeM</option>
        </select>
        <select onChange={e=>setState(e.target.value)}>
          <option value="ALL">All States</option>
          <option value="India">India</option>
        </select>

        <a href="http://localhost:5000/api/bids/excel">
          <button>Download Excel</button>
        </a>
      </div>

      {compare.length > 0 && (
        <div className="compare-box">
          <b>Comparing {compare.length} bids</b>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Buyer</th>
            <th>State</th>
            <th>End Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bids.map(b => (
            <tr key={b.bid_id}>
              <td>
                <input
                  type="checkbox"
                  onChange={() => toggleCompare(b)}
                />
              </td>
              <td>{b.title}</td>
              <td>{b.buyer}</td>
              <td>{b.state}</td>
              <td>{b.end_date}</td>
              <td>
                <a href={b.url} target="_blank">View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

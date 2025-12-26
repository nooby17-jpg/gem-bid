import { useEffect, useState } from "react";

export default function App() {
  const [bids, setBids] = useState([]);
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState({});
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const load = async () => {
    setBids(await fetch("http://localhost:5000/api/bids").then(r => r.json()));
    setStatus(await fetch("http://localhost:5000/api/status").then(r => r.json()));
  };

  useEffect(() => { load(); }, []);

  const compare = selected
    .map(id => bids.find(b => b.bid_no === id))
    .sort((a,b)=>a.price-b.price);

  return (
    <div style={{ padding: 30 }}>
      <h1>GeM Bid Intelligence</h1>
      <p>Last updated: {status.lastUpdated}</p>

      <button onClick={()=>setTheme(theme==="dark"?"light":"dark")}>
        Toggle Theme
      </button>
      <button onClick={()=>fetch("http://localhost:5000/api/refresh",{method:"POST"}).then(load)}>
        Refresh
      </button>
      <a href="http://localhost:5000/api/bids/excel">
        <button>Download Excel</button>
      </a>

      <table>
        <thead>
          <tr>
            <th></th><th>Bid</th><th>Buyer</th><th>Price</th><th></th>
          </tr>
        </thead>
        <tbody>
          {bids.map(b => (
            <tr key={b.bid_no}
              style={compare[0]?.bid_no===b.bid_no ? {background:"#2e7d32"}:{}}
            >
              <td>
                <input type="checkbox"
                  onChange={e =>
                    setSelected(e.target.checked
                      ? [...selected,b.bid_no]
                      : selected.filter(x=>x!==b.bid_no))
                  }
                />
              </td>
              <td>{b.bid_no}</td>
              <td>{b.buyer}</td>
              <td>₹{b.price}</td>
              <td>
                <a href={b.url} target="_blank">Go to GeM</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected.length >= 2 && (
        <p><b>L1:</b> {compare[0].bid_no}</p>
      )}
    </div>
  );
}

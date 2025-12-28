import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Seller() {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [form, setForm] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/seller/my-bids", {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(res => setBids(res.data));
  }, []);

  function submit(e) {
    e.preventDefault();
    axios.post("http://localhost:5000/seller/bid", form, {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(() => window.location.reload());
  }

  return (
    <div className="dashboard">
      <h2>Seller Dashboard</h2>

      <form className="card" onSubmit={submit}>
        <input placeholder="Bid No" onChange={e => setForm({ ...form, bid_no: e.target.value })} />
        <input placeholder="RA No" onChange={e => setForm({ ...form, ra_no: e.target.value })} />
        <input placeholder="Item Title" onChange={e => setForm({ ...form, item_title: e.target.value })} />
        <input placeholder="Department Name" onChange={e => setForm({ ...form, department_name: e.target.value })} />
        <input placeholder="Department Address" onChange={e => setForm({ ...form, department_address: e.target.value })} />
        <input placeholder="State" onChange={e => setForm({ ...form, state: e.target.value })} />
        <input type="date" onChange={e => setForm({ ...form, start_date: e.target.value })} />
        <input type="date" onChange={e => setForm({ ...form, end_date: e.target.value })} />
        <input placeholder="GeM URL" onChange={e => setForm({ ...form, gem_url: e.target.value })} />
        <button>Create Bid</button>
      </form>

      <h3>Your Bids</h3>
      <div className="cards">
        {bids.map(b => (
          <div key={b.id} className="card">
            <strong>{b.item_title}</strong>
            <p>{b.bid_no}</p>
            <p>{b.state}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

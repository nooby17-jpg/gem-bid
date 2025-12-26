export default function Upload() {
  const submit = async e => {
    e.preventDefault();
    const form = new FormData(e.target);

    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: form
    });

    const data = await res.json();
    alert(`Upload complete: ${data.records} records added`);
    e.target.reset();
  };

  return (
    <div style={{ padding: 30 }}>
      <h3>Upload Bid Snapshot</h3>

      <form onSubmit={submit}>
        <label>Source</label><br />
        <select name="source" required>
          <option value="">Select source</option>
          <option value="CPPP">CPPP</option>
          <option value="GEM">GeM</option>
        </select>

        <br /><br />

        <label>Snapshot File (Excel / CSV)</label><br />
        <input type="file" name="file" accept=".xlsx,.xls,.csv" required />

        <br /><br />

        <button type="submit">Upload</button>
      </form>

      <p style={{ marginTop: 20, fontSize: 13 }}>
        Upload official snapshot files downloaded from CPPP or GeM portals.
      </p>
    </div>
  );
}

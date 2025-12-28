import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const upload = async () => {
    const fd = new FormData();
    fd.append("file", file);

    await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: fd
    });

    setMsg("Snapshot uploaded successfully");
  };

  return (
    <div className="container">
      <h2>Upload CPPP Snapshot</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={upload}>Upload</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}

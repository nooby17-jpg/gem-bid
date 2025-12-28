import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BidDetails() {
  const { id } = useParams();
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/bids/${id}/docs`)
      .then(r => r.json())
      .then(setDocs);
  }, []);

  if (!docs.length) return <p>No documents</p>;
  const pdf = docs[0];

  return (
    <div className="container">
      <iframe
        src={`http://localhost:5000/${pdf.file_path}`}
        width="100%"
        height="600"
      />
      <a href={`http://localhost:5000/${pdf.file_path}`} download>
        Download PDF
      </a>
    </div>
  );
}

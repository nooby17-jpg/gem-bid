const db = require("./db");

module.exports = function uploadPdf(bidId, file, userId) {
  db.prepare(`
    INSERT INTO bid_documents
    (bid_id,file_name,file_path,uploaded_by,uploaded_at)
    VALUES (?,?,?,?,?)
  `).run(
    bidId,
    file.originalname,
    file.path,
    userId,
    new Date().toISOString()
  );
};

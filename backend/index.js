const express = require("express");
const cors = require("cors");
const sellerRoutes = require("./routes/seller");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.use("/seller", sellerRoutes);


app.listen(5000, () =>
  console.log("✅ Agorá Tenders backend running on http://localhost:5000")
);

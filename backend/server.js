const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
// Force reliable public DNS servers (fixes querySrv ECONNREFUSED errors
// caused by ISP/router/VPN blocking or mishandling SRV DNS lookups)
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const chatRoutes = require("./routes/chat");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("SynBot backend is running ✅");
});

const PORT = process.env.PORT || 5000;

// Read the same variable that exists in your .env file
const MONGO_URI = process.env.MONGO_CONNECTION_STRING;
console.log("Mongo URI Loaded:", MONGO_URI ? "YES" : "NO");

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:");
    console.error(err); // Prints the full error
  });
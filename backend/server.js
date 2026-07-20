const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const chatRoutes = require("./routes/chat");
const authRoutes = require("./routes/auth");

const app = express();


app.use(cors());
app.use(express.json());


app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("SynBot backend is running ✅");
});

const PORT = process.env.PORT || 5000;


const MONGO_URI = process.env.MONGO_CONNECTION_STRING;
console.log("Mongo URI Loaded:", MONGO_URI ? "YES" : "NO");

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`https://synbot-1.onrender.com${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:");
    console.error(err); 
  });
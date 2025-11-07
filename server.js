require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const bookingsRouter = require("./routes/bookings");
const paymentsRouter = require("./routes/payments");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// mount API
app.use("/api/bookings", bookingsRouter);
app.use("/api/payments", paymentsRouter);

// health
app.get("/_health", (req, res) => res.json({ ok: true }));

app.get("/", (req, res) => {
  res.send("Welcome to Seventeen Visuals API");
});

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB ✅");
    app.listen(PORT, () => console.log(`Server listening on port ${PORT} 🪖`));
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });

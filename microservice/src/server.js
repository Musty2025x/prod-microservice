const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

const appVersion = process.env.APP_VERSION || "1.0.2";
const environment = process.env.NODE_ENV || "development";
const region = process.env.AWS_REGION || "local";

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString()
  });
});

app.get("/version", (req, res) => {
  res.json({
    version: appVersion
  });
});

app.get("/info", (req, res) => {
  res.json({
    hostname: os.hostname(),
    environment,
    region,
    version: appVersion
  });
});

app.listen(PORT, () => {
  console.log(JSON.stringify({
    level: "info",
    message: `Server running`,
    port: PORT,
    environment
  }));
});


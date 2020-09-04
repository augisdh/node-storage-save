const express = require("express");
const cors = require("cors");
const http = require("http");
const multer = require("multer");
const crypto = require("crypto");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/images/",
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err);

      cb(null, file.originalname);
    });
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/image", (req, res) => {
  const imagePath = path.join(__dirname, "./uploads/images/" + req.body.photo);
  res.sendFile(imagePath);
});

app.post("/upload", upload.single("photo"), (req, res) => {
  if (req.file) {
    res.json(req.file);
  } else {
    res.send("Error");
  }
});

const server = http.createServer(app);
server.listen(port, () => console.log(`Server is running: localhost:${port}`));

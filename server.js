const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname)); // يقدّم index.html و data.json

// API لحفظ التحديثات
app.post("/update", (req, res) => {
  fs.writeFileSync("data.json", JSON.stringify(req.body, null, 2));
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

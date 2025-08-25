import express from "express";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

// get data
app.get("/data", (req, res) => {
  fs.readFile("data.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read data.json" });
    res.json(JSON.parse(data));
  });
});

// update data
app.post("/data", (req, res) => {
  fs.writeFile("data.json", JSON.stringify(req.body, null, 2), (err) => {
    if (err) return res.status(500).json({ error: "Failed to save data.json" });
    res.json({ message: "Data saved successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

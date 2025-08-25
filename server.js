const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// 📂 خدمة الملفات الثابتة (HTML, CSS, JS, Images, JSON)
app.use(express.static(path.join(__dirname, "public")));

// 📌 Middleware لفهم JSON
app.use(express.json());

// 📂 مسار ملف الـ data.json
const dataFilePath = path.join(__dirname, "public", "data.json");

// ✅ API لقراءة البيانات
app.get("/api/data", (req, res) => {
  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading data.json:", err);
      return res.status(500).json({ error: "Failed to read data" });
    }

    try {
      const jsonData = JSON.parse(data || "[]");
      res.json(jsonData);
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      res.status(500).json({ error: "Invalid JSON format" });
    }
  });
});

// ✅ API لتحديث البيانات (overwrite)
app.post("/api/data", (req, res) => {
  fs.writeFile(dataFilePath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.error("Error writing to data.json:", err);
      return res.status(500).json({ error: "Failed to save data" });
    }
    res.json({ success: true });
  });
});

// ✅ السيرفر يشتغل
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

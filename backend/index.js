import express from "express";
import mysql from "mysql";
import cors from "cors";
import path from "path"; // Import path
import { fileURLToPath } from 'url'; // Import fileURLToPath

// Determine __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "memba123",
  database: "test",
  port: 3300,
});

// Serve the frontend's build files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handles any requests that don't match the above
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

app.get("/", (req, res) => {
  res.json("hello I'm your local server");
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/books", (req, res) => {
  const q = "INSERT INTO books(`title`,`desc`,`price`,`cover`) VALUES (?)";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `cover`= ? WHERE id = ?";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

const PORT = 5200;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

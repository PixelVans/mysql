import express from "express";
import mysql from "mysql";
import cors from "cors";
import path from "path"; // Import path

const __dirname = path.resolve();

const app = express();
app.use(cors());
app.use(express.json());

// Serve the frontend's build files
app.use(express.static(path.join(__dirname, '/frontend/build')));

// Handles any requests that don't match the above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Database configuration
const db = mysql.createConnection({
  host: "localhost",  // Change this if you're using a different host on Render
  user: "root",
  password: "memba123",  // Make sure to use environment variables for sensitive data
  database: "test",
  port: 3300,  // Adjust the port if necessary for production
});

// API routes
app.get("/api/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/api/books", (req, res) => {
  const q = "INSERT INTO books(title, desc, price, cover) VALUES (?)";

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

app.delete("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.put("/api/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "UPDATE books SET title = ?, desc = ?, price = ?, cover = ? WHERE id = ?";

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

// Use PORT from environment variable or default to 5200
const PORT = process.env.PORT || 5200;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

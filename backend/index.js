import express from "express";
import mysql from "mysql";
import cors from "cors";
import path from "path"; // Import path

const __dirname = path.resolve();

const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const db = mysql.createConnection({
  host: "beghyzmtw4yqwqhcjref-mysql.services.clever-cloud.com",  // Change this if you're using a different host on Render
  user: "ueguyzjufywdfihb",
  password: "9wgjRw3zqrHG97uE9wGB",  // Use environment variables for sensitive data in production
  database: "beghyzmtw4yqwqhcjref",
  port: 3306,  // Adjust the port if necessary for production
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
  const q = "INSERT INTO books(title, `desc`, price, cover) VALUES (?)"; // Changed "desc" to "description"

  const values = [
    req.body.title,
    req.body.desc, // Changed "desc" to "description"
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [values], (err, data) => {
    if (err) {
      console.error('Error inserting book:', err); // Log the error to the console
      return res.status(500).json({ message: 'Error inserting book', error: err }); // Return a 500 status with error message
    }
    console.log('Book inserted successfully:', data); // Log success message with data
    return res.status(201).json(data); // Return a 201 status for created resource
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
  const q = "UPDATE books SET title = ?, `desc` = ?, price = ?, cover = ? WHERE id = ?";

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


app.use(express.static(path.join(__dirname, '../frontend/build')));

// Serve React app for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Catch-all handler to serve the React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Use PORT from environment variable or default to 5200
const PORT = process.env.PORT || 5200;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

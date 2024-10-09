import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../style.css'
const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const res = await axios.get("https://mysqlsaww.onrender.com/api/books"); // Replace with your backend URL
        setBooks(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllBooks();
  }, []);
  
  console.log(books);
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://mysqlsaww.onrender.com/api/books/${id}`); // Replace with your backend URL
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <div>
      <h1> Whispering Pages </h1>
      <div className="books">
        {books.map((book) => (
          <div key={book.id} className="book">
            <img src={book.cover} alt="" />
            <h2>{book.title}</h2>
            <p>{book.desc}</p>
            <span>${book.price}</span>
            <button className="delete" onClick={() => handleDelete(book.id)}>Delete</button>
            <button className="update">
              <Link
                to={`/update/${book.id}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Update
              </Link>
            </button>
          </div>
        ))}
      </div>

      <button className="addHome">
        <Link to="/add" style={{ color: "inherit", textDecoration: "none" }}>
          Add a new book
        </Link>
      </button>
    </div>
  );
};

export default Books;
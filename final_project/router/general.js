const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

    const username = req.body.username;
    const password = req.body.password;

    if(username && password) {
        if(isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        }
        else {
            return res.status(404).json({message: "User already exists!"});

        }
    }
    else {
        return res.status(404).json({message: "Unable to register user."});
    }
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
  });
  

public_users.get('/axios/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    return res.status(200).json(book);
  });
  

  public_users.get('/axios/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      return res.status(200).json(response.data);
    } catch {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
  
    if (!author) {
      return res.status(400).json({ message: "Author parameter is required" });
    }
  
    const books_by_author = Object.values(books).filter(
      book => book.author.toLowerCase() === author.toLowerCase()
    );
  
    if (books_by_author.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }
  
    return res.status(200).json(books_by_author);
  });
  

  public_users.get('/axios/author/:author', async (req, res) => {
    try {
      const author = req.params.author;
      const response = await axios.get(`http://localhost:5000/author/${author}`);
  
      if (!response.data || response.data.length === 0) {
        return res.status(404).json({ message: "No books found for this author" });
      }
  
      return res.status(200).json(response.data);
    } catch {
      return res.status(500).json({ message: "Error fetching books by author" });
    }
  });
  


// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
  
    if (!title) {
      return res.status(400).json({ message: "Title parameter is required" });
    }
  
    const books_by_title = Object.values(books).filter(
      book => book.title.toLowerCase() === title.toLowerCase()
    );
  
    if (books_by_title.length === 0) {
      return res.status(404).json({ message: "No books found for this title" });
    }
  
    return res.status(200).json(books_by_title);
  });
  



  public_users.get('/axios/title/:title', async (req, res) => {
    try {
      const title = req.params.title;
      const response = await axios.get(`http://localhost:5000/title/${title}`);
  
      if (!response.data || response.data.length === 0) {
        return res.status(404).json({ message: "No books found for this title" });
      }
  
      return res.status(200).json(response.data);
    } catch {
      return res.status(500).json({ message: "Error fetching books by title" });
    }
  });
  


//  Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const reviews = book.reviews;
  
    if (!reviews || Object.keys(reviews).length === 0) {
      return res.status(200).json({ message: "No reviews found for this book" });
    }
  
    return res.status(200).json(reviews);
  });
  

module.exports.general = public_users;

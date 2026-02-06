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
  res.json(books);
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
public_users.get('/isbn/:isbn', function (req, res) {
    res.send(books[req.params.isbn]);
});

public_users.get('/axios/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book by ISBN" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  let books_by_author = Object.values(books).filter(book => book.author == req.params.author);

  res.send(JSON.stringify(books_by_author));
});

public_users.get('/axios/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});

  let books_by_title = Object.values(books).filter(book => book.title == req.params.title);

  res.send(JSON.stringify(books_by_title));
});




public_users.get('/axios/title/:title',async function (req, res) {

    try {
        const title = req.params.title;
        const response = axios.get(`http://localhost:5000/title/${title}`);
        res.json(response.data);
    }
    catch (error) {
    res.status(500).json({ message: "Error fetching books by title" });

    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  res.send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;

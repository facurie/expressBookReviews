const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return !users.some(user => user.username == username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
   let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if(authenticatedUser(username,password)) {

    let accessToken = jwt.sign({username},'access',{expiresIn: 60*60});

    req.session.authorization = {accessToken};
    req.session.user = username;
    
    return res.status(200).send("User successfully logged in");

  }
  else{
    return res.status(208).json({ message: "Invalid Login. Check username and password" });

  }

  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

    let review = req.body.review;
    let isbn = req.params.isbn;
    let username = req.user.username;

    if(!username) {
        return res.status(401).json({ message: "User not logged in" });
 
    }

    if(!review) {
        return res.status(404).json({ message: "Error in adding review" });
    }

    const book_to_change = books[isbn];

    if (!book_to_change) {
        return res.status(404).json({ message: "Book not found" });
      }

    book_to_change.reviews[username] = review;

    return res.status(200).json({
        message: "Book review added/updated",
        book: book_to_change
      });
});

regd_users.delete("/auth/review/:isbn", (req,res) => {


    const username = req.user.username;
    const isbn = req.params.isbn;

    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
      }

    const book = books[isbn];
    if(!book) {
        return res.status(404).json({message: "Book not found"});

    }

    if (!book.reviews[username]) {
        return res.status(404).json({ message: "User has no review to delete" });
      }

    delete book.reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully",
        book
      });


})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

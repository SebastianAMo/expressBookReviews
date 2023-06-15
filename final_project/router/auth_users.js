const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(404).json({message: "Error logging in"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization['username'];
  
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];

    // Check if the user has already reviewed the book
    if (book.reviews.hasOwnProperty(username)) {
      // If the user has already reviewed, modify the existing review
      book.reviews[username] = review;
      res.send('Review modified successfully');
    } else {
      // If it's a new review by the user, add it under the ISBN
      book.reviews[username] = review;
      res.send('Review added successfully');
    }
  } else {
    res.send('Book not found');
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];

  // Check if the book exists
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];

    // Check if the user has reviewed the book
    if (book.reviews.hasOwnProperty(username)) {
      // Delete the user's review
      delete book.reviews[username];
      res.send('Review deleted successfully');
    } else {
      res.send('User has not reviewed this book');
    }
  } else {
    res.send('Book not found');
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

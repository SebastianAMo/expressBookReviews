const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  for (let isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push(books[isbn]);
    }
  }
  res.send(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  for (let isbn in books) {
    if (books[isbn].title === title) {
      booksByTitle.push(books[isbn]);
    }
  }
  res.send(booksByTitle);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});


public_users.get('/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    const bookList = response.data;
    res.send(bookList);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


public_users.get('/book/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    const bookDetails = response.data;
    res.send(bookDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

public_users.get('/book/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    const booksByAuthor = response.data;
    res.send(booksByAuthor);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


public_users.get('/book/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    const booksByTitle = response.data;
    res.send(booksByTitle);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports.general = public_users;

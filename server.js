const express = require('express');
const app = express();
const port = 3344;



// Array to store registered users
const users = [];

// Body parsing middleware
app.use(express.json());

// Register new user
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(409).json({ error: 'Username already taken' });
  }

  // Create a new user object
  const newUser = {
    username,
    password,
  };

  // Add the new user to the users array
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
});
// Login as a registered user
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Find the user with the provided username
    const user = users.find((user) => user.username === username);
  
    // Check if the user exists and the password is correct
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  
    res.status(200).json({ message: 'Login successful' });
  });



// Import the book data
const books = require('./books');

// Get the book list available in the shop
app.get('/books', (req, res) =>
{
    res.json(books);
});

// Get the books based on ISBN
app.get('/books/isbn/:isbn', (req, res) =>
{
    const isbn = req.params.isbn;
    const book = books.find((book) => book.isbn === isbn);
    res.json(book);
});

// Get all books by the author
app.get('/books/author/:author', (req, res) =>
{
    const author = req.params.author;
    const booksByAuthor = books.filter((book) => book.author === author);
    res.json(booksByAuthor);
});

// Get all books based on title
app.get('/books/title/:title', (req, res) =>
{
    const title = req.params.title;
    const booksByTitle = books.filter((book) => book.title === title);
    res.json(booksByTitle);
});

// Get a book review
app.get('/books/review/:id', (req, res) =>
{
    const id = req.params.id;
    const book = books.find((book) => book.id === parseInt(id));
    res.json(book.review);
});
// Add/modify a book review
app.put('/books/:id/review', (req, res) => {
    const bookId = req.params.id;
    const { review } = req.body;
  
    // Find the book with the provided ID
    const book = books.find((book) => book.id === parseInt(bookId));
  
    // Check if the book exists
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
  
    // Update the book review
    book.review = review;
  
    res.status(200).json({ message: 'Book review updated successfully' });
  });
// Delete book review added by that particular user
app.delete('/books/:id/review', (req, res) => {
    const bookId = req.params.id;
  
    // Find the book with the provided ID
    const book = books.find((book) => book.id === parseInt(bookId));
  
    // Check if the book exists
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
  
    // Check if the user has added a review for the book
    if (!book.review) {
      return res.status(404).json({ error: 'Book review not found' });
    }
  
    // Delete the book review
    book.review = '';
  
    res.status(200).json({ message: 'Book review deleted successfully' });
  });
  
// Get all books - Using async callback function
app.get('/bookss', async (req, res) => {
    try {
      // Retrieve all books asynchronously
      const allBooks = await getAllBooks();
  
      res.status(200).json(allBooks);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Asynchronous function to retrieve all books
  function getAllBooks() {
    return new Promise((resolve, reject) => {
      // Simulate asynchronous operation (e.g., fetching books from a database)
      setTimeout(() => {
        // Assuming you have an array of books
        const books = [
          { id: 1, title: 'Book 1', author: 'Author 1' },
          { id: 2, title: 'Book 2', author: 'Author 2' },
          { id: 3, title: 'Book 3', author: 'Author 3' },
        ];
  
        resolve(books);
      }, 1000); // Simulating a delay of 1 second
    });
  }
  // Search by ISBN - Using Promises
app.get('/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
  
    // Search for the book by ISBN asynchronously
    searchBookByISBN(isbn)
      .then((book) => {
        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
        }
  
        res.status(200).json(book);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  
  // Asynchronous function to search for a book by ISBN
  function searchBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      // Simulate asynchronous operation (e.g., fetching book from a database)
      setTimeout(() => {
        // Assuming you have a data source containing books
        const books = [
          { id: 1, title: 'Book 1', author: 'Author 1', isbn: '1234567890' },
          { id: 2, title: 'Book 2', author: 'Author 2', isbn: '0987654321' },
          { id: 3, title: 'Book 3', author: 'Author 3', isbn: '9876543210' },
        ];
  
        const book = books.find((book) => book.isbn === isbn);
        resolve(book);
      }, 1000); // Simulating a delay of 1 second
    });
  }
// Search by Author
app.get('/books/author/:author', (req, res) => {
    const author = req.params.author;
  
    // Search for books by author
    const matchingBooks = searchBooksByAuthor(author);
  
    if (matchingBooks.length === 0) {
      return res.status(404).json({ error: 'No books found for the author' });
    }
  
    res.status(200).json(matchingBooks);
  });
  
  // Function to search for books by author
  function searchBooksByAuthor(author) {
    // Assuming you have a data source containing books
    const books = [
      { id: 1, title: 'Book 1', author: 'Author 1', isbn: '1234567890' },
      { id: 2, title: 'Book 2', author: 'Author 2', isbn: '0987654321' },
      { id: 3, title: 'Book 3', author: 'Author 3', isbn: '9876543210' },
    ];
  
    const matchingBooks = books.filter((book) =>
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  
    return matchingBooks;
  }
    
app.listen(port, () =>
{
    console.log(`Server is running on port ${port}`);
});


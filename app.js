const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// Sequelize
const db = require('./db');
const { Book } = db.models;

// db connection test
db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


// static assets
app.use('/static', express.static('public'));

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded( { extended: false }));
app.use(bodyParser.json());


// ROUTES 

// HOME
app.get('/', (req, res) => {
  res.redirect('/books');
});

// ALL BOOKS
app.get('/books', async (req, res) => {

  try {

    let booksData = [];
    const books = await Book.findAll({})
    books.map( book => {
      booksData.push(book.toJSON())
    });
    // console.log( books.map(book => book.toJSON()));
    res.render('all_books', { booksData });

  } catch(error) {
      res.render('error');
    }

});

// NEW BOOK
app.get('/books/new', (req, res) => {
  res.render('new_book', {});
});

// CREATE NEW BOOK REQUIRE VALIDATION
app.post('/books/new', async (req, res, next) => {
  
  try {

    const book = await Book.create(req.body);
    res.redirect('/books/' + book.id);

  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
      next();
    } else {
      res.render('error');
      }
  }
});

// GET BOOK BY ID
app.get('/books/:id', async (req, res) => {

  try {
    const bookId = req.params.id;
    let targetedBook;
    let bookData = {};


    const book = await Book.findByPk(bookId);
    targetedBook = book.toJSON();
    bookData = {
      id: targetedBook.id,
      title: targetedBook.title,
      author: targetedBook.author,
      genre: targetedBook.genre,
      year: targetedBook.year,
    };
    
    res.render('book_detail', { bookData });

  } catch(error) {
      res.render('error');
    }
});

// UPDATE BOOK DATA REQUIRE VALIDATION
app.post('/books/:id', async (req, res) => {

  try {
    const bookId = req.params.id;

    const book = await Book.findByPk(bookId);
    await book.update(req.body);

    res.redirect(`/books/${book.id}`);

  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
      next();
    } else {
      res.render('error');
      }
  }

  
});

// DELETE BOOK
app.post('/books/:id/delete', async (req, res) => {

  try {
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);
    await book.destroy();

    res.redirect(`/books`);

  } catch(error) {
      res.render('error');
    }
});

// error handling middleware
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// code to execute in case express didnt find a matching get request
app.use((err, req, res) => {
  

  res.status(err.status);
  res.render('404', { error: err })

  let errorMessage = "Request message: " + err.message;
  errorMessage += "\nRequest status: " + err.status;
  errorMessage += "\nError stack: " + err.stack;

  console.log(errorMessage);
});


db.sequelize.sync().then(() => {
  app.listen(3000, () => console.log("Running on port 3000"));
});




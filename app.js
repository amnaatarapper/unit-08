const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// SEQUELIZE
const db = require('./db');
const {
  Book
} = db.models;

// DB CONNECTION TEST
db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


// SERVE STATIC ASSETS
app.use('/static', express.static('public'));

// SET VIEW ENGINE
app.set('view engine', 'pug');

// PARSE HTTP RES/REQ
app.use(bodyParser.urlencoded({
  extended: false
}));
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
    books.map(book => {
      booksData.push(book.toJSON())
    });
    // console.log( books.map(book => book.toJSON()));
    res.render('all_books', {
      booksData
    });

  } catch (error) {
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

  } catch (error) {
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

    res.render('book_detail', {
      bookData
    });

  } catch (error) {
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

  } catch (error) {
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

  } catch (error) {
    res.render('error');
  }
});

// 404 Route
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {

  // ERROR DETAILS TO THE USER
  res.status(err.status);
  res.render('404', {
    error: err
  })

  // ERROR DETAILS ON THE CONSOLE
  let errorMessage = "Request message: " + err.message;
  errorMessage += "\nRequest status: " + err.status;
  errorMessage += "\nError stack: " + err.stack;

  console.log(errorMessage);
});


// SYNC THE DATABASE AND SERVE THE APP
db.sequelize.sync().then(() => {

  app.listen(process.env.PORT || 3000, () => {
    console.log('server is up on localhost:3000')
  })

});
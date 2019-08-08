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

  let booksData = [];
  

  try {
    const books = await Book.findAll({})
    books.map( book => {
      booksData.push(book.toJSON())
    });
    // console.log( books.map(book => book.toJSON()));


  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      throw error;
    }
  }

  res.render('all_books', { booksData });
});

// NEW BOOK
app.get('/books/new', (req, res) => {
  res.render('new_book', {});
});

// CREATE NEW BOOK
app.post('/books/new', async (req, res) => {

  try {

    const book = await Book.create(req.body);
    bookById = book.toJSON();
    res.redirect('/books');

  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      throw error;
    }
  }

  res.redirect('/books/' + book.id);


});

// GET BOOK BY ID
app.get('/books/:id', async (req, res) => {

  
  const bookId = req.params.id;
  let targetedBook;
  let bookData = {};

  try {

    const book = await Book.findByPk(bookId);
    targetedBook = book.toJSON();
    bookData = {
      id: targetedBook.id,
      title: targetedBook.title,
      author: targetedBook.author,
      genre: targetedBook.genre,
      year: targetedBook.year,
    };
    
  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      throw error;
    }
  }


  res.render('book_detail', { bookData });

});

// UPDATE BOOK DATA
app.post('/books/:id', async (req, res) => {

  
  const bookId = req.params.id;


  try {

    const book = await Book.findByPk(bookId);
    await book.update(req.body);

  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      throw error;
    }
  }

  res.redirect(`/books/${bookId}`);
});



// DELETE BOOK
app.post('/books/:id/delete', async (req, res) => {

  
  const bookId = req.params.id;


  try {

    const book = await Book.findByPk(bookId);
    await book.destroy();

  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      throw error;
    }
  }

  res.redirect(`/books`);
});














db.sequelize.sync().then(() => {
  app.listen(3000, () => console.log("Running on port 3000"));
});




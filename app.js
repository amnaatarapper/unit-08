const express = require('express');
const app = express();


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


// (async () => {
  
//   await db.sequelize.sync();

//   try {
//     const books = await Book.findAll({

//     });
//     console.log( books.map(book => book.toJSON()) );

//   } catch(error) {
//     if (error.name === 'SequelizeValidationError') {
//       const errors = error.errors.map(err => err.message);
//       console.error('Validation errors: ', errors);
//     } else {
//       throw error;
//     }
//   }
// })();

app.get('/', (req, res) => {
  res.redirect('/books');
});

app.get('/books', async (req, res) => {

  let booksData = [];
  

  try {
    const books = await Book.findAll({})
    books.map( book => {
      booksData.push(book.toJSON())
    });
    console.log( books.map(book => book.toJSON()));


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


app.get('/books/new', (req, res) => {
  res.render('new_book', {});
});












db.sequelize.sync().then(() => {
  app.listen(3000, () => console.log("Running on port 3000"));
});





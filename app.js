const db = require('./db');
const { Book } = db.models;

(async () => {
  await db.sequelize.sync();

  try {
    const books = await Book.findAll({
      
    });
    console.log( books.map(book => book.toJSON()) );

  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      throw error;
    }
  }
})();

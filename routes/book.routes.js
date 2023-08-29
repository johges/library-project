const express = require('express');
const router = express.Router();

const Book = require('../models/Book.model');
const Author = require("../models/Author.model")

require("../models/Book.model")

/* GET home page */
router.get("/books", (req, res, next) => {
    Book.find()
        .populate("author")
        .then((booksFromDB) => {
            // console.log(booksFromDB)

            const data = {
                books: booksFromDB
            }

            res.render("books/books-list", data)
            //res.send(`we have ${booksFromDB.length} books in our database`);
        })
        .catch(e => {
            console.log("error getting list of books from DB", e);
            next(e);
        });
})

// CREATE: display form
router.get("/books/create", (req, res, next) => {
    Author.find()
        .then( authorsFromDB => {
            const data = {
                authors: authorsFromDB
            }
            res.render("books/book-create", data);
        })
        .catch((e) => {
            console.log("Error getting list of authors from DB", e);
            next(e);
        });
});

// POST /books/create (process form)
router.post("/books/create", (req, res, next) => {
    const newBook = {
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        rating: req.body.rating
    };

    Book.create(newBook)
        .then((newBook) => {
            res.redirect("/books")
        })
        .catch(e => {
            console.log("error creating new book", e);
            next(e);
        });
})

// GET route to display the form to update a specific book
router.get('/books/:bookId/edit', (req, res, next) => {
    const { bookId } = req.params;

    Book.findById(bookId)
        .populate("author")
        .then(bookToEdit => {
            // console.log(bookToEdit);
            res.render('books/book-edit.hbs', { book: bookToEdit });
        })
        .catch(error => next(error));
});


// POST route to actually make updates on a specific book
router.post('/books/:bookId/edit', (req, res, next) => {
    const { bookId } = req.params;
    const { title, description, author, rating } = req.body;

    Book.findByIdAndUpdate(bookId, { title, description, author, rating }, { new: true })
        .then(updatedBook => res.redirect(`/books/${updatedBook.id}`))
        .catch(error => next(error));
});


// POST route to delete a book from the database
router.post('/books/:bookId/delete', (req, res, next) => {
    const { bookId } = req.params;

    Book.findByIdAndDelete(bookId)
        .then(() => res.redirect('/books'))
        .catch(error => next(error));
});


// GET /books/:booksId
router.get("/books/:bookId", (req, res, next) => {
    const id = req.params.bookId
    Book.findById(id)
        .populate("author")
        .then(bookFromDB => {
            res.render("books/book-details", bookFromDB)
        })
        .catch(e => {
            console.log("error getting book details from DB", e);
            next(e);
        });
    // res.send(`this rout works... displaying details for book with id ... ${id}`)
})


module.exports = router;
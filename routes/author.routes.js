const express = require('express');
const router = express.Router();

const Author = require("../models/Author.model")

require("../models/Author.model")

/* GET home page */
router.get("/authors", (req, res, next) => {
    Author.find()
        .then((authorsFromDB) => {
            const data = {
                authors: authorsFromDB
            }

            res.render("authors/authors-list", data)
        })
        .catch(e => {
            console.log("error getting list of books from DB", e);
            next(e);
        });
})

module.exports = router;
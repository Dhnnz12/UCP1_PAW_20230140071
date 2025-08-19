const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');
const db = require('./database/db.js'); 

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  const query = 'SELECT * FROM buku';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.render('index', { books: results });
  });
});


app.get('/add', (req, res) => {
  res.render('form', { book: null });
});

app.get('/edit/:id', (req, res) => {
    const bookId = req.params.id;
    const query = 'SELECT * FROM buku WHERE id = ?';
    db.query(query, [bookId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('form', { book: results[0] });
        } else {
            res.redirect('/');
        }
    });
});

app.post('/buku', (req, res) => {
  const newBook = req.body;
  const query = 'INSERT INTO buku SET ?';
  db.query(query, newBook, (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.put('/buku/edit/:id', (req, res) => {
  const bookId = req.params.id;
  const updatedBook = req.body;
  const query = 'UPDATE buku SET ? WHERE id = ?';
  db.query(query, [updatedBook, bookId], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.delete('/buku/delete/:id', (req, res) => {
  const bookId = req.params.id;
  const query = 'DELETE FROM buku WHERE id = ?';
  db.query(query, [bookId], (err, result) => {
    if (err) {
      console.error(err); 
      return res.status(500).send('Error deleting book');
    }
    
    if (result.affectedRows === 0) {
      console.log(`Buku dengan ID ${bookId} tidak ditemukan.`);
    }
    console.log(`Buku dengan ID ${bookId} berhasil dihapus.`);
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
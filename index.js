const db = require('./db');
const Author = require('./Author');
const Books = require('./Books');

const app = {}

app.init = async () => {
    // prisijungti prie duomenu bazes
    const conn = await db.init({
        host: 'localhost',
        user: 'root',
        database: 'books',
    });

    // LOGIC BELOW
    const nedasK = await Author.create(conn, 'Nedas', 'Klasukauskas');
    console.log(nedasK);

    const rokasK = await Author.create(conn, 'Rokas', 'Kibirinis');
    console.log(rokasK);

    const authors = await Author.listAll(conn);
    console.log(authors);
}

app.init();

module.exports = app;
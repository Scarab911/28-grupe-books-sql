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
    async function autoriaiAllMethods() {
        console.log('');
        let nedasK = await Author.create(conn, 'Nedas', 'Klasukauskas');
        console.log(nedasK);

        console.log('');
        const rokasK = await Author.create(conn, 'Rokas', 'Kibirinis');
        console.log(rokasK);

        // console.log('');
        // let authors = await Author.listAll(conn);
        // console.log(authors);

        // console.log('');
        // let uniqAuthor = await Author.findById(conn, 1);
        // console.log(uniqAuthor);

        // console.log('');//ieskom neegzistuojancio id
        // uniqAuthor = await Author.findById(conn, 99);
        // console.log(uniqAuthor);

        // console.log('');
        // let nedas = await Author.findByFirstname(conn, 'nedas');
        // console.log(nedas);

        // console.log('');
        // let klasukauskas = await Author.findByLastname(conn, 'klasukauskas');
        // console.log(klasukauskas);

        // console.log('');
        // let update1 = await Author.updatePropertyById(conn, 1, 'firstname', 'Saulius');
        // console.log(update1);

        // console.log('');
        // let update2 = await Author.updatePropertyById(conn, 3, 'firstname', 'Kestas');
        // console.log(update2);

        // console.log('');
        // let update3 = await Author.updatePropertyById(conn, 3, 'nuIrKa', 'Bezdzione');
        // console.log(update3);

        // console.log('');
        // authors = await Author.listAll(conn);
        // console.log(authors);

        // console.log('');
        // let delete1 = await Author.delete(conn, 5.5);
        // console.log(delete1);

        // console.log('');
        // delete1 = await Author.delete(conn, 1);
        // console.log(delete1);

        // console.log('');
        // authors = await Author.listAll(conn);
        // console.log(authors);
        console.log('');
        let lopecius = await Author.create(conn, 'Kapsukas', 'Lopecius');
        console.log(lopecius);
        console.log('');
        let skrebutis = await Author.create(conn, 'Jurgis', 'Skrebutis');
        console.log(skrebutis);
        console.log('');
        let slepsys = await Author.create(conn, 'Antanas', 'Slepsys');
        console.log(slepsys);

        // console.log('');
        // nedas = await Author.findByFirstname(conn, 'asd" OR "2" = "2');
        // console.log(nedas);

        // console.log('');
        // authors = await Author.listAll(conn);
        // console.log(authors);
    }

    async function booksAllMethods() {
        console.log('');
        let createBook = await Books.create(conn, 1, 'Seselis', 1999);
        console.log(createBook);

        console.log('');
        createBook = await Books.create(conn, 2, 'Seselis', 2018);
        console.log(createBook);

        console.log('');
        let listAllBooks = await Books.listAll(conn);
        console.log(listAllBooks);

        console.log('');
        let knygaPagalVarda = await Books.findByName(conn, 'seselis');
        console.log(knygaPagalVarda);

        console.log('');
        let knygaPagalMetus = await Books.findByYear(conn, 1999);
        console.log(knygaPagalMetus);

        console.log('');
        let updateBook = await Books.updateById(conn, 2, 'release_year', 2017);
        console.log(updateBook);

        console.log('');
        let updateBookName = await Books.updateNameById(conn, 2, 'Kopos Seselyje');
        console.log(updateBookName);

        console.log('');
        let updateBookYear = await Books.updateYearById(conn, 2, 2020);
        console.log(updateBookYear);

        console.log('');
        createBook = await Books.create(conn, 1, 'Kopustu laukas', 1995);
        console.log(createBook);

        console.log('');
        createBook = await Books.create(conn, 1, 'Saule', 2001);
        console.log(createBook);

        console.log('');
        createBook = await Books.create(conn, 4, 'Barsuko Kelione Namo', 2001);
        console.log(createBook);

        console.log('');
        listAllBooks = await Books.listAll(conn);
        console.log(listAllBooks);

        //trinam knygas
        console.log('');
        let deleteBookByID = await Books.delete(conn, 2);
        console.log(deleteBookByID);

        console.log('');
        let deleteAllBooksByAuthorsID = await Books.deleteAllByAuthorId(conn, 1);
        console.log(deleteAllBooksByAuthorsID);

        console.log('');
        listAllBooks = await Books.listAll(conn);
        console.log(listAllBooks);

    }
    await autoriaiAllMethods();
    await booksAllMethods();


}

app.init();

module.exports = app;
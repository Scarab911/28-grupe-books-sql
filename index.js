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

        console.log('');
        let authors = await Author.listAll(conn);
        console.log(authors);

        console.log('');
        let uniqAuthor = await Author.findById(conn, 1);
        console.log(uniqAuthor);

        console.log('');//ieskom neegzistuojancio id
        uniqAuthor = await Author.findById(conn, 99);
        console.log(uniqAuthor);

        console.log('');
        let nedas = await Author.findByFirstname(conn, 'nedas');
        console.log(nedas);

        console.log('');
        let klasukauskas = await Author.findByLastname(conn, 'klasukauskas');
        console.log(klasukauskas);

        console.log('');
        let update1 = await Author.updatePropertyById(conn, 1, 'firstname', 'Saulius');
        console.log(update1);

        console.log('');
        let update2 = await Author.updatePropertyById(conn, 3, 'firstname', 'Kestas');
        console.log(update2);

        console.log('');
        let update3 = await Author.updatePropertyById(conn, 3, 'nuIrKa', 'Bezdzione');
        console.log(update3);

        console.log('');
        authors = await Author.listAll(conn);
        console.log(authors);

        console.log('');
        let delete1 = await Author.delete(conn, 5.5);
        console.log(delete1);

        console.log('');
        delete1 = await Author.delete(conn, 1);
        console.log(delete1);

        console.log('');
        authors = await Author.listAll(conn);
        console.log(authors);

        let lopecius = await Author.create(conn, 'Kapsukas', 'Lopecius');
        console.log(lopecius);

        let skrebutis = await Author.create(conn, 'Jurgis', 'skrebutis');
        console.log(skrebutis);

        let slepsys = await Author.create(conn, 'Antanas', 'slepsys');
        console.log(slepsys);

        console.log('');
        nedas = await Author.findByFirstname(conn, 'asd" OR "2" = "2');
        console.log(nedas);

        console.log('');
        authors = await Author.listAll(conn);
        console.log(authors);
    }
    await autoriaiAllMethods();


}

app.init();

module.exports = app;
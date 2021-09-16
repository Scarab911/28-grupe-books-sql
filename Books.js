/**
 * Kaip rasyti JSDOc'sus?
 * Link: https://jsdoc.app
 */
const Validation = require('./Validations');
const Books = {};

/**
 * Autoriaus isleistos knygos irasymas i duombaze.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} authorId Autoriaus ID.
 * @param {string} bookName Knygos pavadinimas.
 * @param {number} bookReleaseYear Knygos isleidimo metai.
 * @returns {Promise<string>} Tekstas, apibudinantis, koks autorius ir kurias metais isleido knyga.
 */
Books.create = async (connection, authorId, bookName, bookReleaseYear) => {
    //VALIDATION:
    if (!Validation.isText(bookName)) {

        return `Parametras turi buti ne tuscias tekstas!`;
    }
    if (!Validation.IDisValid(authorId)) {

        return `Parametras turi buti sveikasis skaicius!`;
    }
    if (!Validation.IDisValid(bookReleaseYear)) {

        return `Parametras turi buti sveikasis skaicius!`;
    }
    //LOGIC
    const sql = 'INSERT INTO `books`\
                     (\
                    `id`, `book_name`,\
                      `author_id`,\
                       `release_year`\
                       ) VALUES (\
                        NULL, "'+ bookName + '", "' + authorId + '", " ' + bookReleaseYear + '");';

    const [rows] = await connection.execute(sql);

    return `Knyga - "${bookName}" buvo sekmingai irasyta!`;
}

/**
 * Visu autoriu isleistu knygu sarasas.
 * @param {object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @returns {Promise<Object[]>} Tekstas, apibudinantis, koks autorius ir kurias metais isleido knyga.
 */
Books.listAll = async (connection) => {
    const sql = 'SELECT \
                    `book_name`,\
                    `release_year`,\
                    `authors`.`firstname`,\
                    `authors`.`lastname`\
                FROM `books`\
                LEFT JOIN `authors`\
                ON `authors`.`id` = `books`.`author_id`';

    const [rows] = await connection.execute(sql);

    let count = 0;
    const infoList = [];
    for (let { book_name, release_year, firstname, lastname } of rows) {
        infoList.push(`${++count}. Knyga "${book_name}", autorius - ${firstname} ${lastname}, isleista ${release_year} m.`)
    };

    const title = 'Knygu sarasas:\n';

    return title + infoList.join('\n');
}

/**
 * Knygos paieska pagal pavadinima.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {string} bookName Knygos pavadinimas.
 * @returns {Promise<Object[]>} Sarasas su knygu objektais.
 */
Books.findByName = async (connection, bookName) => {
    //VALIDATION:

    if (!Validation.isText(bookName)) {

        return `Parametras turi buti ne tuscias tekstas!`;
    }
    //LOGIC

    const sql = 'SELECT \
                    `book_name`,\
                    `release_year`,\
                    `authors`.`firstname`,\
                    `authors`.`lastname`\
                FROM `books`\
                LEFT JOIN `authors`\
                    ON `authors`.`id` = `books`.`author_id`\
                WHERE `book_name` LIKE "' + bookName + '"';

    const [rows] = await connection.execute(sql);

    let infoList = [];
    let count = 0;
    if (rows.length === 0) {
        return `Tokios Knygos nera!`;
    } else {
        for (const { book_name, release_year, firstname, lastname } of rows) {
            infoList.push(`${++count}. "${book_name}", autorius - ${firstname} ${lastname}, isleista ${release_year} m.`);
        }
        const title = `Pagal ieskoma knygos pavadinima - "${bookName}", rasta knygu ${count}:\n`;

        return title + infoList.join('\n');
    }
}

Books.findByYear = async (connection, bookReleaseYear) => {
    //VALIDATION:

    if (!Validation.IDisValid(bookReleaseYear)) {

        return `Parametras turi buti sveikasis keturzenklis skaicius!`;
    }
    //LOGIC

    const sql = 'SELECT \
                    `book_name`,\
                    `release_year`,\
                    `authors`.`firstname`,\
                    `authors`.`lastname`\
                FROM `books`\
                LEFT JOIN `authors`\
                    ON `authors`.`id` = `books`.`author_id`\
                WHERE `release_year` LIKE "' + bookReleaseYear + '"';

    const [rows] = await connection.execute(sql);

    let infoList = [];
    let count = 0;
    if (rows.length === 0) {
        return `Tokios Knygos nera!`;
    } else {
        for (const { book_name, release_year, firstname, lastname } of rows) {
            infoList.push(`${++count}. "${book_name}", autorius - ${firstname} ${lastname}, isleista ${release_year} m.`)
        }
        const title = `Pagal ieskomus metus - ${bookReleaseYear}, rasta knygu ${count}:\n`;

        return title + infoList.join('\n');
    }
}

Books.updateById = async (connection, bookId, propertyName, propertyValue) => {
}

Books.updateNameById = async (connection, bookId, bookName) => {
}

Books.updateYearById = async (connection, bookId, bookReleaseYear) => {
}

Books.delete = async (connection, bookId) => {
}

Books.deleteAllByAuthorId = async (connection, authorId) => {
}

module.exports = Books;
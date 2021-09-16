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

/**
 * Knygos paieska pagal metus.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} bookReleaseYear Knygos sukurimo metai.
 * @returns {Promise<Object[]>} Sarasas su knygu objektais.
 */
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

/**
 * Knygos duomenu atnaujinimas.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} bookId Knygos ID.
 * @param {string} propertyName Atnaujinamas parametras is lenteles.
 * @param {string or number} propertyValue Reiksme i kuriama keiciama.
 * @returns {Promise<Object[]>} Grazina pranesima apie atlikta operacija.
 */
Books.updateById = async (connection, bookId, propertyName, propertyValue) => {
    if (!Validation.IDisValid(bookId)) {

        return `Autoriaus ID turi buti teigiamas sveikasis skaicius!`;
    }
    if (!Validation.isText(propertyName)) {

        return `Parametras turi buti ne tuscias tekstas!`;
    }
    const sql2 = 'SELECT *\
                FROM INFORMATION_SCHEMA.COLUMNS\
                    WHERE TABLE_NAME = N\'books\'';

    let [rows] = await connection.execute(sql2);
    //susipaprastinam gauta rez iki array
    const a = rows.map(obj => obj.COLUMN_NAME);

    //tikrinam ar sarase yra norimas pakeisti parametras
    if (!a.includes(propertyName)) {
        return `Tokia savybe neegzistuoja, atnaujinti neimanoma!`
    }
    //LOGIC
    const sql = 'UPDATE `books`\
                     SET `' + propertyName + '` = "' + propertyValue + '"\
                      WHERE `books`.`id` =' + bookId;
    [rows] = await connection.execute(sql);

    if (rows.affectedRows === 0) {
        return `Pagal duota ID - ${bookId} knyga nerasta, atnaujinti nepavyko!`;
    } else {
        return `Knygos duomenys atnaujinti sekmingai!`;
    }
}

/**
 * Knygos pavadinimo atnaujinimas.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} bookId Knygos ID.
 * @param {string} bookName Naujas knygos pavadinimas.
 * @returns {Promise<Object[]>} Grazina pranesima apie atlikta operacija.
 */
Books.updateNameById = async (connection, bookId, bookName) => {
    if (!Validation.IDisValid(bookId)) {

        return `Knygos ID turi buti teigiamas sveikasis skaicius!`;
    }
    if (!Validation.isText(bookName)) {

        return `Knygos pavadinimas turi buti ne tuscias tekstas!`;
    }

    //LOGIC
    const sql = 'UPDATE `books`\
                     SET `book_name` = "' + bookName + '"\
                      WHERE `books`.`id` =' + bookId;
    [rows] = await connection.execute(sql);

    if (rows.affectedRows === 0) {
        return `Pagal duota ID - ${bookId} knyga nerasta, atnaujinti nepavyko!`;
    } else {
        return `Knygos pavadinimas atnaujintas sekmingai!`;
    }
}

/**
 * Knygos isleidimo metu atnaujinimas.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} bookId Knygos ID.
 * @param {number} bookReleaseYear Nauji knygos metai.
 * @returns {Promise<Object[]>} Grazina pranesima apie atlikta operacija.
 */
Books.updateYearById = async (connection, bookId, bookReleaseYear) => {
    //VALIDATION:
    if (!Validation.IDisValid(bookId)) {

        return `Knygos ID turi buti teigiamas sveikasis skaicius!`;
    }
    if (!Validation.IDisValid(bookReleaseYear)) {

        return `Knygos metai turi buti sveikasis keturzenklis skaicius!`;
    }
    //LOGIC
    const sql = 'UPDATE `books`\
                     SET `release_year` = "' + bookReleaseYear + '"\
                      WHERE `books`.`id` =' + bookId;
    [rows] = await connection.execute(sql);

    if (rows.affectedRows === 0) {
        return `Pagal duota ID - ${bookId} knyga nerasta, atnaujinti nepavyko!`;
    } else {
        return `Knygos metai atnaujinti sekmingai!`;
    }
}
/**
 * Pasaliname knyga is lenteles pagal duota ID.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} bookId Knygos ID.
 * @returns {Promise<Object[]>} Grazina pranesima apie atlikta operacija.
 */
Books.delete = async (connection, bookId) => {
    //VALIDATION:
    if (!Validation.IDisValid(bookId)) {

        return `Knygos ID turi buti teigiamas sveikasis skaicius!`;
    }

    //LOGIC
    const sql = 'DELETE FROM `books`\
                      WHERE `books`.`id` =' + bookId;

    [rows] = await connection.execute(sql);

    if (rows.affectedRows === 0) {
        return `Pagal duota ID - ${bookId} knyga nerasta, istrinti nepavyko!`;
    } else {
        return `Knyga su ID - ${bookId} sekmingai pasalinta is duomenu bazes!`;
    }
}
/**
 * Pasaliname knyga is lenteles pagal duota autoriaus ID.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} authorId Autoriaus ID.
 * @returns {Promise<Object[]>} Grazina pranesima apie atlikta operacija.
 */
Books.deleteAllByAuthorId = async (connection, authorId) => {
    //VALIDATION:
    if (!Validation.IDisValid(authorId)) {

        return `Autoriaus ID turi buti teigiamas sveikasis skaicius!`;
    }

    //LOGIC
    const sql = 'DELETE FROM `books`\
                      WHERE `books`.`author_id` =' + authorId;

    [rows] = await connection.execute(sql);

    if (rows.affectedRows === 0) {
        return `Pagal duota ID - ${authorId} knyga nerasta, istrinti nepavyko!`;
    } else {
        return `Knygos su autoriaus ID - ${authorId} sekmingai pasalintos is duomenu bazes!`;
    }
}

module.exports = Books;
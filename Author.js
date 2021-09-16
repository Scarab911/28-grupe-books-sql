const Validation = require('./Validations');

const Author = {};

/**
 * Autoriaus irasymas i duombaze.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes manipuliavimo metodus.
 * @param {string} authorFirstname Autoriaus vardas.
 * @param {string} authorLastname Autoriaus pavarde.
 * @returns {Promise<string>} Tekstinis pranesimas pranesanti apie atlikta operacija, irasyma i duomenu baze.
 */
Author.create = async (connection, authorFirstname, authorLastname) => {
    //VALIDATION:
    if (!Validation.isValidFirstName(authorFirstname)) {

        return `Vardas negali buti tuscias arba is mazosios raides!`;
    }
    if (!Validation.isValidLastName(authorLastname)) {

        return `Pavarde negali buti tuscia arba is mazosios raides!`;
    }
    //LOGIC
    const sql = 'INSERT INTO`authors`\
                (`id`, `firstname`, `lastname`)\
             VALUES\
                (NULL, "' + authorFirstname + '", "' + authorLastname + '")';

    const [rows] = await connection.execute(sql);

    return `${authorFirstname} ${authorLastname} buvo sekmingai irasytas!`;
}

/**
 * Visu autoriu sarasas.
 * @param {object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @returns {Promise<Object[]>} Tekstas, apibudinantis, kokie autoriai uzregistruoti duomenu bazeje.
 */
Author.listAll = async (connection) => {

    const sql = 'SELECT *\
            FROM `authors`';

    const [rows] = await connection.execute(sql);

    let count = 0;
    const infoList = [];
    for (let { firstname, lastname } of rows) {
        infoList.push(`${++count}. ${firstname} ${lastname}.`)
    };

    const title = 'Autoriu sarasas:\n';

    return title + infoList.join('\n');
}

/**
 * Autoriaus paieska pagal id.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} authorId Autoriaus Id numeris.
 * @returns {Promise<Object[]>} Grazina autoriaus varda ir pavarde pagal ieskoma ID.
 */
Author.findById = async (connection, authorId) => {
    //VALIDATION:
    if (!Validation.IDisValid(authorId)) {

        return `Autoriaus ID turi buti teigiamas sveikasis skaicius!`;
    }

    const sql = 'SELECT * FROM `authors` WHERE `id` =' + authorId;

    const [rows] = await connection.execute(sql);

    if (rows.length === 0) {
        return `Tokio autoriaus nera!`;
    } else {
        const name = rows[0].firstname;
        const surname = rows[0].lastname;
        const response = `${name} ${surname}.`
        const title = `Pagal id - ${authorId} rastas autorius:\n`;

        return title + response;
    }

}

/**
 * Autoriaus paieska pagal varda.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {string} authorFirstname Autoriaus vardas.
 * @returns {Promise<Object[]>} Grazina autoriaus varda ir pavarde pagal ieskoma varda.
 */
Author.findByFirstname = async (connection, authorFirstname) => {
    //VALIDATION:

    if (!Validation.isValidFirstName(authorFirstname)) {

        return `Vardas negali buti tuscias arba is mazosios raides!`;
    }
    //LOGIC
    const sql = 'SELECT * FROM `authors` WHERE `firstname` LIKE "' + authorFirstname + '"';
    const [rows] = await connection.execute(sql);

    console.log(rows);
    if (rows.length === 0) {
        return `Tokio autoriaus nera!`;
    } else {
        const name = rows[0].firstname;
        const surname = rows[0].lastname;
        const response = `${name} ${surname}.`
        const title = `Pagal ieskoma varda - ${authorFirstname}, rastas autorius:\n`;

        return title + response;
    }

}

/**
 * Autoriaus paieska pagal pavarde.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {string} authorLastname Autoriaus pavarde.
 * @returns {Promise<Object[]>} Grazina autoriaus varda ir pavarde pagal ieskoma pavarde.
 */
Author.findByLastname = async (connection, authorLastname) => {
    //VALIDATION:

    if (!Validation.isValidLastName(authorLastname)) {

        return `Pavarde negali buti tuscia arba is mazosios raides!`;
    }
    const sql = 'SELECT * FROM `authors` WHERE `lastname` LIKE "' + authorLastname + '"';

    const [rows] = await connection.execute(sql);

    if (rows.length === 0) {
        return `Tokio autoriaus nera!`;
    } else {
        const name = rows[0].firstname;
        const surname = rows[0].lastname;
        const response = `${name} ${surname}.`
        const title = `Pagal ieskoma pavarde - ${authorLastname}, rastas autorius:\n`;


        return title + response;
    }
}

/**
 * Autoriaus duomenu atnaujinimas.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} authorId Autoriaus ID.
 * @param {string} propertyName Atnaujinamas parametras is lenteles.
 * @param {string} propertyValue Reiksme i kuriama keiciama.
 * @returns {Promise<Object[]>} Grazina pranesima apie atlikta operacija.
 */
Author.updatePropertyById = async (connection, authorId, propertyName, propertyValue) => {//VALIDATION:
    if (!Validation.IDisValid(authorId)) {

        return `Autoriaus ID turi buti teigiamas sveikasis skaicius!`;
    }
    if (!Validation.isText(propertyName)) {

        return `Parametras turi buti ne tuscias tekstas!`;
    }
    if (!Validation.isText(propertyValue)) {

        return `Parametras turi buti ne tuscias tekstas!`;
    }
    //gaunam lenteleje esanciu stulpeliu pavadinimus
    const sql2 = 'SELECT *\
                FROM INFORMATION_SCHEMA.COLUMNS\
                    WHERE TABLE_NAME = N\'authors\'';

    let [rows] = await connection.execute(sql2);
    //susipaprastinam gauta rez iki array
    const a = rows.map(obj => obj.COLUMN_NAME);

    //tikrinam ar sarase yra norimas pakeisti parametras
    if (!a.includes(propertyName)) {
        return `Tokia savybe neegzistuoja, atnaujinti neimanoma!`
    }
    //LOGIC
    const sql = 'UPDATE `authors`\
                     SET `' + propertyName + '` = "' + propertyValue + '"\
                      WHERE `authors`.`id` =' + authorId;
    [rows] = await connection.execute(sql);

    if (rows.affectedRows === 0) {
        return `Pagal duota ID - ${authorId} autorius nerastas, atnaujinti nepavyko!`;
    } else {
        return `Autoriaus duomenys atnaujinti sekmingai!`;
    }
}

/**
 * Autoriaus pasalinimas is sistemos pagal duota ID.
 * @param {Object} connection Objektas, su kuriuo kvieciame duombazes mainpuliavimo metodus.
 * @param {number} authorId Autoriaus ID.
 * @returns {Promise<Object[]>} Grazina pranesima apie atlikta operacija.
 */
Author.delete = async (connection, authorId) => {
    //VALIDATION:
    if (!Validation.IDisValid(authorId)) {

        return `Autoriaus ID turi buti teigiamas sveikasis skaicius!`;
    }

    //LOGIC
    const sql = 'DELETE FROM `authors`\
                      WHERE `authors`.`id` =' + authorId;

    [rows] = await connection.execute(sql);

    if (rows.affectedRows === 0) {
        return `Pagal duota ID - ${authorId} autorius nerastas, istrinti nepavyko!`;
    } else {
        return `Autorius su ID - ${authorId} sekmingai pasalintas is duomenu bazes!`;
    }
}

module.exports = Author;
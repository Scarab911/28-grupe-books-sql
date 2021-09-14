const Author = {};


Author.create = async (connection, authorFirstname, authorLastname) => {
    const sql = 'INSERT INTO`authors`\
                (`id`, `firstname`, `lastname`)\
             VALUES\
                (NULL, "' + authorFirstname + '", "' + authorLastname + '")';

    const [rows] = await connection.execute(sql);

    return `${authorFirstname} ${authorLastname} buvo sekmingai irasytas!`;
}

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

Author.findById = async (connection, authorId) => {

    const sql = 'SELECT * FROM `authors` WHERE `id` =' + authorId;

    const [rows] = await connection.execute(sql);

    if (rows.length === 0) {
        return `Tokio autoriaus nera!`;
    } else {
        const name = rows[0].firstname;
        const surname = rows[0].lastname;
        const response = `${name} ${surname}.`
        const title = 'Pasirinktas autorius:\n';

        return title + response;
    }

}

Author.findByFirstname = async (connection, authorFirstname) => {
}

Author.findByLastname = async (connection, authorLastname) => {
}

Author.updatePropertyById = async (connection, authorId, propertyName, propertyValue) => {
}

Author.delete = async (connection, authorId) => {
}

module.exports = Author;
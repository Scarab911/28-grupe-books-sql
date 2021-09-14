const Author = {};

let sql = '';
let count = 0;
let response = '';
let infoList = [];

Author.create = async (connection, authorFirstname, authorLastname) => {
    sql = 'INSERT INTO`authors`\
                (`id`, `firstname`, `lastname`)\
             VALUES\
                (NULL, "' + authorFirstname + '", "' + authorLastname + '")';

    [rows] = await connection.execute(sql);

    return `${authorFirstname} ${authorLastname} buvo sekmingai irasytas!`;
}

Author.listAll = async (connection) => {
    sql = 'SELECT *\
            FROM `authors`';

    [rows] = await connection.execute(sql);

    count = 0;

    for (let { firstname, lastname } of rows) {
        infoList.push(`${++count}. ${firstname} ${lastname}.`)
    };

    const title = 'Autoriu sarasas:\n';

    return title + infoList.join('\n');
}

Author.findById = async (connection, authorId) => {
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
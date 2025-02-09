const pool = require("./pool");

function createTableQuery(tableName, columns) {
    const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, ''); // Basic sanitization
    return `CREATE TABLE IF NOT EXISTS ${sanitizedTableName} (${columns});`;
}

const createMembershipTable = createTableQuery(
    "membership",
    "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, type VARCHAR(255)"
);

const createUsersTable = createTableQuery(
    "users",
    "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, firstName VARCHAR(255), lastName VARCHAR(255), email VARCHAR(255), password VARCHAR(255), membership INT REFERENCES membership(id)"
);

const createMessagesTable = createTableQuery(
    "messages",
    "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, title VARCHAR(255), message VARCHAR(255), timestamp TIMESTAMP DEFAULT NOW(), user INT REFERENCES users(id)"
);


async function setupDatabase() {
    try {
        await pool.query(createMembershipTable);
        await pool.query(createUsersTable);
        await pool.query(createMessagesTable);
        console.log("Tables created and data inserted successfully!");
    } catch (err) {
        console.error("Error setting up database:", err);
    } finally {
        pool.end(); // Close the connection pool
    }
}

setupDatabase();

module.exports = { setupDatabase };

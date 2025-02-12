const pool = require("./pool");

async function createUser(firstName, lastName, email, password) {
    const result = await pool.query(`INSERT INTO users (firstName, lastName, email, password_hash, membership)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`,
    [firstName, lastName, email, password, 1]);
    return result.rows[0];
}

async function updateUserMembership(email) {
    const result = await pool.query(
        `UPDATE users SET membership = $1 WHERE email = $2 RETURNING *;`,
        [2, email] // 2 means member
    );
    return result.rows[0];
}

async function updateUserMembershipToAdmin(email) {
    const result = await pool.query(
        `UPDATE users SET membership = $1 WHERE email = $2 RETURNING *;`,
        [3, email] // 2 means admin
    );
    return result.rows[0];
}

async function createMessage(title, message, userId) {
    // Insert the message
    const result = await pool.query(
        `INSERT INTO messages (title, message, user_id)  
         VALUES ($1, $2, $3)  
         RETURNING *;`,
        [title, message, userId]
    );

    return result.rows[0]; // Returns the created message
}

async function getMessages() {
    const result = await pool.query(`
        SELECT messages.*, users.firstname, users.lastname
        FROM messages
        JOIN users ON messages.user_id = users.id;
    `);
    return result.rows;  // This will return all messages with user info
}

async function deleteMessage(id) {
    const result = await pool.query(`
        DELETE FROM MESSAGES WHERE id = $1`, [id]);
    return result.rows[0];
}



module.exports = {
    createUser,
    updateUserMembership,
    updateUserMembershipToAdmin,
    createMessage,
    getMessages,
    deleteMessage
};

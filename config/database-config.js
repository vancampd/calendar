require('dotenv').config();
const {HOST, MAIN_USER, PASSWORD, DATABASE} = process.env

module.exports = {
    connection: {
        host: HOST,
        user: MAIN_USER,
        password: PASSWORD,
        database: DATABASE
    }
}
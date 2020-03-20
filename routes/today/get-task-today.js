const client = require("../../lib/db");
const moment = require("moment");

module.exports = async (req, res, next) => {
    try {
        const table = req.params.table;
        let query = `SELECT * FROM task`;
        query += ` WHERE task_date::date = now()::date `;
 
        let response;
        let result = await client.query(query);
        response = result.rows;
        res.send(response);
    } catch (err) {
        next(err);
    }
};

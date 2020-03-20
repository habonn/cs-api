const client = require("../../lib/db");

module.exports = async (req, res, next) => {
    try {

        let querySelect = `SELECT running_no FROM runcode WHERE year = ${req.params.year} AND pre_fix = '${req.params.pre_fix}' `
        let queryCheck = await client.query(querySelect);
        let number = parseInt(queryCheck.rows[0].running_no);
        let response = {}
        if (queryCheck.rowCount != 0) {
            number++;
            let query = `update runcode set running_no = '${pad(number, 6)}' where year = ${req.params.year} AND pre_fix = '${req.params.pre_fix}' `;
            let result = await client.query(query);
            // response = result.rows;
            res.status(204).send();
        } 

    } catch (err) {
        next(err);
    }
};

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
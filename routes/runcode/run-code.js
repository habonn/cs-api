const client = require("../../lib/db");
const dbColumns = require("../../lib/db-columns");
const commonColumns = require("../../lib/common-columns");
const uuid = require("uuid");
const dbTables = require("../../lib/db-tables");
const moment = require("moment");

module.exports = async (req, res, next) => {
    try {

        let year = moment().format('YYYY')
        let query = `SELECT * FROM runcode WHERE year = ${year} `;

        let response = {};
        let running = "";
        let result = await client.query(query);
        response.rows = result.rows;
        if(response.rows.length === 0){
            let queryInsert = `insert into runcode (year, pre_fix, running_no, created_by, created_date) values ('${moment().format('YYYY')}', 'TN', '000001', 'tmp', NOW()) `;
            await client.query(queryInsert);
            running = 'TN' + moment().format('YYYY') + '000001';
        }
        else
        {
            running = response.rows[0].pre_fix + response.rows[0].year + response.rows[0].running_no;
        }
        var splitrun = running.replace( /\s/g, '');
        res.send(splitrun);
    } catch (err) {
        next(err);
    }
};

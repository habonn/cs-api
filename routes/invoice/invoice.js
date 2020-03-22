const client = require("../../lib/db");
const dbTables = require("../../lib/db-tables");
const dbColumns = require("../../lib/db-columns");
const jsclient = require('jsreport-client')('http://localhost:5488')

module.exports = async (req, res, next) => {
    try {
        console.log("req.params.table", req.params.table);
        console.log("req.params.id", req.params.id);

        const table = req.params.table;
        const id = req.params.id;


        const tables = await dbTables.getTables();
        // const columns = await dbColumns.getColumns(table);
        const tableIdx = tables.findIndex(a => a.name === table);
        if (tableIdx === -1) {
            throw Error(`Invalid table ${table}`);
        }

        let query = `SELECT *`;
        query += ` FROM ${table}`;
        query += ` where ${tables[tableIdx].pk} = $1`;
        query += ` limit 1`;

        let response = {};
        let result = await client.query(query, [id]);
        if (result.rows.length < 1) {
            throw Error(`Not found record in ${table} with id ${id}`);
        }
        response = result.rows[0];
        jsclient.render({
            template:{shortid:"rkJTnK2ce"},data:response
        }).then((response) => response.pipe(res))
            .catch(next)
        // res.send(response);
    } catch (err) {
        next(err);
    }
};

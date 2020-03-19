const client = require("../../lib/db");
const createFilter = require("odata-v4-pg").createFilter;
const dbTables = require("../../lib/db-tables");

module.exports = async (req, res, next) => {
    try {
        console.log("req.query.$filter", req.query.$filter);
        console.log("req.params.table", req.params.table);
        console.log("req.params.column", req.params.column);

        const table = req.params.table;
        const column = req.params.column;

        let filter;
        try {
            filter = createFilter(req.query.$filter);
            // console.log("filter", filter);
        } catch (error) {
            throw Error(`Invalid filter ${req.query.$filter}`);
        }

        const tables = await dbTables.getTables();
        const tableIdx = tables.findIndex(a => a.name === table);
        if (tableIdx === -1) {
            throw Error(`Invalid table ${table}`);
        }

        let query = `SELECT  ${tables[tableIdx].pk} as value ,`;

        if (table === "sys_user") {
            query += `  CONCAT(${column}, ' ', last_name) as text FROM ${table}`;
            query += ` where role = 'Technician' `;
        }
        else if (table === "customer"){
            query += `  CONCAT(${column}, ' ', last_name) as text FROM ${table}`;
        } else {
            query += ` ${column} as text FROM ${table}`;
            query += ` where ${filter.where}`;
        }
        query += ` order by ${column}`;

        let response = {};
        let result = await client.query(query, filter.parameters);
        response.rows = result.rows;

        // let queryCount = `SELECT count(*) FROM ${table}`;
        // let resultCount = await client.query(queryCount);
        // response.totalCount = parseInt(resultCount.rows[0].count);
        response.totalCount = response.rows.length;

        res.send(response);
    } catch (err) {
        next(err);
    }
};

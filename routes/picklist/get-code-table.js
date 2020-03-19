const client = require("../../lib/db");
const dbTables = require("../../lib/db-tables");

module.exports = async (req, res, next) => {
    try {
        const table = "code_table";
        const codeTableCode = req.params.codeTableCode;

        const tables = await dbTables.getTables();
        const tableIdx = tables.findIndex(a => a.name === table);
        if (tableIdx === -1) {
            throw Error(`Invalid table ${table}`);
        }

        let query = `SELECT code_value as value , description1 as text FROM ${table}`;
        query += ` where code_table_code = $1`;

        query += ` order by description1`;

        let response = {};
        let result = await client.query(query, [codeTableCode]);
        response.rows = result.rows;

        let queryCount = `SELECT count(*) FROM ${table}`;
        queryCount += ` where code_table_code = $1`;
        let resultCount = await client.query(queryCount, [codeTableCode]);
        response.totalCount = parseInt(resultCount.rows[0].count);

        res.send(response);
    } catch (err) {
        next(err);

    }
};

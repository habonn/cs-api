const client = require("../../lib/db");
const dbTables = require("../../lib/db-tables");

module.exports = async (req, res, next) => {
    try {
        console.log("req.params.table", req.params.table);
        console.log("req.params.id", req.params.id);
        const table = req.params.table;
        const id = req.params.id;

        const tables = await dbTables.getTables();

        const tableIdx = tables.findIndex(a => a.name === table);
        if (tableIdx === -1) {
            throw Error(`Invalid table ${table}`);
        }
        const tableObj = tables[tableIdx];

        let query = `delete from ${table}`;
        let valIdx = 1;
        let queryParams = [];

        query += ` where ${tableObj.pk} = $${valIdx}`;
        valIdx++;
        queryParams.push(id);

        await client.query(query, queryParams);

        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

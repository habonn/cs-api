const client = require("../../lib/db");
const createFilter = require("odata-v4-pg").createFilter;
const dbColumns = require("../../lib/db-columns");
const dbTables = require("../../lib/db-tables");

module.exports = async (req, res, next) => {
    try {
        console.log("req.query.$skip", req.query.skip);
        console.log("req.query.$skip", req.query.top);
        console.log("req.query.$param", req.query.param);

        let top = req.query.$top;
        if (!top || top > 1000) {
            top = 1000;
        }
        let skip = req.query.$skip;
        if (!skip || skip < 0) {
            skip = 0;
        }

        let filter;
        try {
            filter = createFilter(req.query.$filter);
            // console.log("filter", filter);
        } catch (error) {
            throw Error(`Invalid filter ${req.query.$filter}`);
        }

        const table = req.params.table;
        const tables = await dbTables.getTables();
        const columns = await dbColumns.getColumns(table);
        const tableIdx = tables.findIndex(a => a.name === table);
        if (tableIdx === -1) {
            throw Error(`Invalid table ${table}`);
        }


        var queryString = ' WHERE 1=1 ';
        if (table === "customer") {
            Object.keys(req.query).forEach(function (key) {
                if (req.query[key] != '') {
                    if (key == 'first_name') queryString += " AND (lower(first_name) LIKE '%" + req.query[key] + "%' OR lower(last_name) LIKE '%" + req.query[key] + "%' OR (upper(first_name) LIKE '%" + req.query[key] + "%' OR upper(last_name) LIKE '%" + req.query[key] + "%' OR first_name LIKE '%" + req.query[key] + "%' OR last_name LIKE '%" + req.query[key] + "%'))";
                    else if (key == 'email') queryString += " AND lower(email) LIKE '%" + req.query[key] + "%' OR upper(email) LIKE '%" + req.query[key] + "%'";
                    else if (key == 'tel') queryString += " AND tel LIKE '%" + req.query[key] + "%'";
                }
            });
        } else if (table === "sys_user") {
            Object.keys(req.query).forEach(function (key) {
                if (req.query[key] != '') {
                    if (key == 'first_name') queryString += " AND (lower(first_name) LIKE '%" + req.query[key] + "%' OR lower(last_name) LIKE '%" + req.query[key] + "%' OR (upper(first_name) LIKE '%" + req.query[key] + "%' OR upper(last_name) LIKE '%" + req.query[key] + "%' OR first_name LIKE '%" + req.query[key] + "%' OR last_name LIKE '%" + req.query[key] + "%'))";
                    else if (key == 'username') queryString += " AND lower(username) LIKE '%" + req.query[key] + "%' OR upper(username) LIKE '%" + req.query[key] + "%' OR username LIKE '%" + req.query[key] + "%'";
                    else if (key == 'role') queryString += " AND role LIKE '%" + req.query[key] + "%'";
                }
            });
        } else if (table === "task") {
            Object.keys(req.query).forEach(function (key) {
                if (req.query[key] != '') {
                    if (key == 'technician_name') queryString += " AND sys_user_id  = '" + req.query[key] + "'";
                    else if (key == 'type') queryString += " AND type = '" + req.query[key] + "'";
                    else if (key == 'task_no') queryString += " AND task_no LIKE '%" + req.query[key] + "%'";
                    else if (key == 'taskDateFrom') queryString += " AND task_date >= '" + req.query[key] + "'";
                    else if (key == 'taskDateTo') queryString += " AND task_date <= '" + req.query[key] + "'";
                    else if (key == 'status') queryString += " AND status  = '" + req.query[key] + "'";
                }
            });
        }

        let queryParams = filter.parameters;
        let query = `SELECT * FROM ${table}`;

        query += queryString + ` ORDER BY updated_date DESC limit ${top} offset ${skip}`;

        let queryCount = `SELECT count(*) FROM ${table}` + queryString;


        let response = {};
        let result = await client.query(query, queryParams);
        response.rows = result.rows;

        let resultCount = await client.query(queryCount, queryParams);
        response.totalCount = parseInt(resultCount.rows[0].count);

        res.send(response);
    } catch (err) {
        next(err);
    }
};




const client = require("../../lib/db");

module.exports = async (req, res, next) => {
    try {
        const table = req.params.table;
        let query = `SELECT `;
        query += ` coalesce(sum(case when type = '1' then 1 else 0 end),0)::INTEGER as "totalWater",`;
        query += ` coalesce(sum(case when type = '2' then 1 else 0 end),0)::INTEGER as "totalFire",`;
        query += ` coalesce(sum(case when type = '3' then 1 else 0 end),0)::INTEGER as "totalElectric",`;
        query += ` coalesce(sum(case when type = '4' then 1 else 0 end),0)::INTEGER as "totalBuild",`;
        query += ` coalesce(sum(case when type = '5' then 1 else 0 end),0)::INTEGER as "totalRepair",`;
        query += ` coalesce(sum(case when type = '6' then 1 else 0 end),0)::INTEGER as "totalOdds"`;
        query += ` FROM task`;

        let response;
        let result = await client.query(query);
        response = result.rows[0];
        res.send(response);
    } catch (err) {
        next(err);
    }
};

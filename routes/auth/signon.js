const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = process.env.JWT_SECRET || "secret";
const jwtExpire = process.env.JWT_EXPIRE || "1d";
const client = require("../../lib/db");

module.exports = async (req, res, next) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res
                .status(400)
                .json({ errors: { username: "invalid username or password" } })
        }

        let query = `SELECT sys_user_id, password, first_name, last_name, role FROM sys_user WHERE username=($1) limit 1`;
        let results = await client.query(query, [req.body.username]);


        var errNot = new Error("invalid username or password");
        errNot.status = 400;
        if (results.rowCount == 0) {
            // return res
            //     .status(400)
            //     .json({ errors: { username: "invalid username or password" } })
            return next(errNot);
        }

        var errCustom = new Error();
        errCustom.status = 401;
        if (results.rows[0].role == "Technician") {
            return next(errCustom);
        }

        bcrypt.compare(
            req.body.password,
            results.rows[0].password,
            async function(err, isMatch) {
                if (err) {
                    throw Error(err);
                } else if (!isMatch) {
                    return res.status(400).json({
                        errors: { username: "invalid username or password" }
                    });
                } else {
                    query = `UPDATE sys_user SET last_access_date=($1) WHERE username=($2)`;
                    await client.query(query, ["NOW()", req.body.username]);
                    res.status(200).json({
                        token: jwt.sign(
                            {
                                uid: results.rows[0].sys_user_id,
                                un: req.body.username,
                                fn: results.rows[0].first_name,
                                ln: results.rows[0].last_name,
                                rl: results.rows[0].role
                            },
                            jwtSecret,
                            { expiresIn: jwtExpire }
                        )
                    });
                }
            }
        );
    } catch (err) {
        next(err);
    }
};

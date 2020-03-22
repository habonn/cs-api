const client = require("../../lib/db");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const nodemailer = require('nodemailer');
const { mailtemp } = require("./email_template")

module.exports = async (req, res, next) => {
    try {
        const user = "tmp";
        const pgm = "register";

        let queryCol = "";
        let queryVal = "";
        let valIdx = 1;
        let queryParams = [];

        queryCol += ` sys_user_id`;
        queryVal += `$${valIdx}`;
        valIdx++;
        queryParams.push(uuid.v4());

        queryCol += `, created_by`;
        queryVal += `, $${valIdx}`;
        valIdx++;
        queryParams.push(user);

        queryCol += `, created_date`;
        queryVal += `, NOW()`;

        queryCol += `, created_pgm`;
        queryVal += `, $${valIdx}`;
        valIdx++;
        queryParams.push(pgm);



        for (prop in req.body) {
            queryCol += `, ${prop}`;
            queryVal += `, $${valIdx}`;
            valIdx++;
            let param = req.body[prop];

            if (prop == "password") {
                param = bcrypt.hashSync(param, 12);
            }
            if (param === "") {
                param = null;
            }
            queryParams.push(param);
        }

        let check = `select * from sys_user where username = ($1)`;
        let checkresult = await client.query(check, [req.body.username]);

        if (checkresult.rowCount != 0) {
            next(new Error('User already exists!'));
        } else {
            let query = `insert into sys_user (${queryCol}) values (${queryVal})`;
            let result = await client.query(query, queryParams);
            response = result.rows[0];
            res.status(204).send();

            var name = req.body.first_name
            var email = req.body.email
            var username = req.body.username
            var password = req.body.password
            var content = `name: ${name} \n email: ${email} \n message: ${content} `

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'habonn4@gmail.com', // your email
                    pass: 'peamzaza00' // your email password
                }
            });

            // setup email data with unicode symbols
            const mailOptions = {
                from: 'habonn4@gmail.com', // sender
                to: email,              // list of receivers
                subject: `Hello ${name}, You can log-in to Total System`,            // Mail subject
                html: mailtemp(username, password) // HTML body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function (err, info) {
                if (err)
                    console.log(err)
                else
                    console.log(info);
            });

        }

    } catch (err) {
        next(err);
    }
};

var generator = require('generate-password');

module.exports = async (req, res, next) => {
    try {
        
        var password = generator.generate({
            length: 10,
            numbers: true
        });

        res.send(password);
    } catch (err) {
        next(err);
    }
};

const jwt = require('jsonwebtoken');
const generateToken = (id) => {
    return jwt.sign({id},'rodrigo', {
        expiresIn:'30d',
    });
};

module.exports = generateToken;
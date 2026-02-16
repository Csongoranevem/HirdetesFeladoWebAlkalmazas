
const jwt = require('jsonwebtoken');

function ensureSecret(){
    if (!process.env.ACCESS_TOKEN_SECRET ) {
        const message = 'ACCESS_TOKEN_SECRET is not defined';
        console.error(message);
        throw new Error(message);
    }
    return process.env.ACCESS_TOKEN_SECRET;
}

function generateToken(payload) {
    const secret = ensureSecret();
    const tokenOptions = {
        expiresIn: '1h',
    };
    return jwt.sign(payload, secret, tokenOptions);
}


function verifyToken(token){
    const secret = ensureSecret();
    return jwt.verify(token, secret);
}

function authenticate(req, res, next){
    const authHeader = req.headers.authorization || ''
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        req.user = verifyToken(token);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

}


module.exports = {
    generateToken,
    ensureSecret,
    verifyToken,
    authenticate
};

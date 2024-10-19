const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Require JWT token
    let token = req.cookies['Authorization'];
    if (token === undefined) {
        res.status(401).send('Cannot access resource, no JWT provided!');
        return;
    }
    if (!token.startsWith("Bearer ")) {
        res.status(401).send('Cannot access resource, incorrect token format!')
    }
    token = token.substring(7);

    // Verify JWT
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.username = decoded.username;
        next();
    } catch (err) {
        res.status(401).send('Cannot access resource, invalid JWT!');
    }
}

module.exports = verifyToken;
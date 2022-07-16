const jwt = require('jsonwebtoken');


exports.generateAccessToken = (userPayload) => {
    return jwt.sign(userPayload, process.env.TOKEN_SECRET);
}

exports.auth = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
    })
    next()
}
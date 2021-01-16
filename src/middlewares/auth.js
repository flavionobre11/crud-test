const jwt = require('jsonwebtoken')
const configAuth = require('../config/auth.json')


module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).send({ message: 'no token provided.'})

    const parts = authHeader.split(' ');

    if(!parts.length === 2)
        return res.status(401).send({ message: 'error on token.'})
    
    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({ message: 'token malformatted'})
    
    jwt.verify(token, configAuth.secret, (err, decoded) => {
        if (err) 
            return res.status(401).send({ message: 'token invalid'})

        req.userId = decoded.id;
        console.log(req.userId +" | "+req.body);
        return next();


    })


}
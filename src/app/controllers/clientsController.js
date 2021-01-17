const express = require('express')
const authMiddleware = require('../middlewares/auth')

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) =>{
    res.send({
        message: 'usuario autenticado',
        employerId: req.userId,
        name: req.userName,
        acessAt: Date.now()
    })
})


module.exports = app => app.use('/clients', router);
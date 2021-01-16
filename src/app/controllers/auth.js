const express = require('express');
const Employer = require('../models/schemaEmployer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const configAuth = require('../../config/auth.json')

const router = express.Router();


function tokenGenerate(params = {}){
    return jwt.sign(params, configAuth.secret, {
        expiresIn: 7200
    })
}

// middleware
router.use((req, res, next) => {
    var date = new Date();
    console.log(date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+' | Tivemos um acesso em auth 👀');
    next();
})

// registro de usuario funcionario
router.post('/register', async (req, res) => {
    const { email } = req.body
    
    try {

        // verifica se ja existe esse e-mail cadastrado
        if (await Employer.findOne({ email }))
            return res.status(400).send({
                message: 'User already exists'
            });
        
        // cria funcionário
        const employer = await Employer.create(req.body);

        // não mostrar a senha na response
        employer.password = undefined;

        // token para auth
        const token = tokenGenerate({id: employer.id});

        // retorna response
        return res.send({ employer, token })

    } catch (err) {
        return res.status(400).send({
            status: '400',
            message: 'Employer register fail.',
            err: this.err
        })
    }
});

// autenticacao de usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if(!email)
        return res.status(400).send({
            message: 'email empty.'
        });

    if(!password)
        return res.status(400).send({
            message: 'password empty.'
        });


    const employer = await Employer.findOne({ email }).select('+password')

    if (!employer)
        return res.status(400).send({
            message: 'User not found.'
        });
    
    if (!await bcrypt.compare(password, employer.password))
        return res.status(400).send({
            message: 'Invalid password'
        })

    const token = tokenGenerate({
        id: employer.id,
        name: employer.name
    });

    employer.password = undefined;
    res.send({ employer, token })
})

module.exports = app => app.use('/auth', router)
const express = require('express');
const Employer = require('../models/schemaEmployer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const configAuth = require('../../config/auth.json')
const crypto = require('crypto')

const router = express.Router();


function tokenGenerate(params = {}){
    return jwt.sign(params, configAuth.secret, {
        expiresIn: 7200
    })
}


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

        // logs de registro
        var date = new Date();
        console.log(date.getHours()+
            ':'+date.getMinutes()+
            ':'+date.getSeconds()+
            ' | Registro de '+ employer.email+' realizado 🤸');

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

    // verifica se o email esta vazio
    if(!email)
        return res.status(400).send({
            message: 'email empty.'
        });
    
    // verifica se a senha esta vazio
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

    // gera um token com id e name como keys
    const token = tokenGenerate({
        id: employer.id,
        name: employer.name
    });


    // não mostrar a senha na response
    employer.password = undefined;


    // logs de registro
    var date = new Date();
    console.log(date.getHours()+
        ':'+date.getMinutes()+
        ':'+date.getSeconds()+
        ' | Login de '+ employer.name+' realizado 🤸');


    res.send({ employer, token })
})

router.post('/forgot_password', async (req, res) =>{
    const { email } = req.body;

    try {
        const employer = await Employer.findOne({ email })

        if (!employer)
            return res.status(400).send({
                message: 'User not found.'
            })

        // gerando token para verificacao
        // adicionado no models/employer    
        const token = crypto.randomBytes(20).toString('hex');

        // definindo data de expiracao do token
        const now = new Date();
        now.setMinutes(now.getMinutes()+10);

        // setando valores no usuario
        await Employer.findByIdAndUpdate(employer.id, {
            '$set':{
                resetPasswordToken: token,
                resetPasswordTime: now
            }
        },  { new: true, useFindAndModify: false });

        console.log(token, now);
        
    } catch (err) {
        return res.status(400).send({
            message: 'error on forgot password. try again please.'
        })
    }
})

module.exports = app => app.use('/auth', router)
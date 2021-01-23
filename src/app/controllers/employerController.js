const express = require('express')
const authMiddleware = require('../middlewares/auth')
const Employer = require('../models/schemaEmployer')

const router = express.Router();

router.use(authMiddleware);

function emailValidator(email){
    if(!email) return false
    if(/\S+@\S+\.\S+/.test(email)) return true
    return false
}

// load session
router.get('/load_session', async (req, res) =>{
    const token = req.headers.authorization.split(' ')[1];
    
    try {
        const employer = await Employer.findById(req.userId).select(
            '-password -lastReset -resetPasswordToken -resetPasswordTime');
        
        if(!employer)
            return res.status(400).send({
                message: 'employer not found'
            })
        
        res.send({
            token,
            employer
        })
        
    } catch (err) {
        return res.status(400).send({
            message: 'erro on load session. check token.'
        })
    }



})

// listar employers
router.get('/', async (req, res) =>{
    try {
        const employers = await Employer.find().select('-password')
        return res.send({ employers })
    } catch (err) {
        return res.status(400).send({
            message: 'employers generate list error'
        })
    }
})

router.get('/:employerId', async (req, res) => {
    try {
        const employer = await Employer.findById(req.params.employerId).select('-password')

        if (!employer)
            return res.status(400).send({
                message: 'user not found.'
            })

        return res.send({ employer })
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            message: 'find employer error'
        })
    }
})

// router.post(criacao) ja esta criado em auth/register/

router.put('/:employerId', async (req, res) => {
    const { email, name, password} = req.body;
    const query = {}
    if(email){
        if(!(emailValidator(email))){
            return res.status(400).send({
                message: 'invalid email.'
            })
        }
        query.email = email;
    }

    if(password){
        if (password.length < 7)
            return res.status(400).send({
                message: 'the password is more than 6 characters'
            });
        query.password = password
    }
    
    if(name) query.name = name;
    

    try {
        const employer = await Employer.findByIdAndUpdate(
            req.params.employerId, 
            {$set: query}, 
            { new: true, useFindAndModify: false },
            (err) => {
                if(err) return res.status(400).send({
                    message: 'error while updating. is the correct id?',
                    err: err
                })
            }
        )

        employer.save();
        return res.send({
            message: 'update success'
        })

    } catch (err) {
        return res.status(400).send({
            message: 'update employer error'
        })
    }
})


router.delete('/:employerId', async (req, res) => {
    try {
        await Employer.findByIdAndRemove(req.params.employerId).select('-password')

        return res.send({
            message: 'user removed.'
        })
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            message: 'delete employer error'
        })
    }
})


module.exports = app => app.use('/employer', router);
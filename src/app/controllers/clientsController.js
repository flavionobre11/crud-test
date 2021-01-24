const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Client = require('../models/schemaClient');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) =>{
    try {
        const client = await Client.find().populate({
            path: 'createdBy',
            select: 'name -_id'
        });
        res.send({ client })
        
    } catch (err) {
        res.status(400).send({
            message: 'cannot generate client list.'
        });
    }
});


router.get('/:clientId', async (req, res) => {
    try {
        const client = await Client.findById(req.params.clientId);

        if (!client)
            return res.status(400).send({
                message: 'client not found.'
        })

        res.send({ client });


    } catch (err) {
        res.status(400).send({
            message: 'cannot find client.'
        });
    }
})

router.post('/', async (req, res) => {
    const { name, surname, contact } = req.body;


    // verificando se nome e vazio
    if (!name)
        return res.status(400).send({
            message: 'name is required.'
    });

    // verificando se sobrenome e vazio
    if (!surname)
        return res.status(400).send({
            message: 'surname is required.'
    });

    // verificando se contact e vazio
    if (!contact)
        return res.status(400).send({
            message: 'contact is required.'
    });

    try {
        
        // verifica se ja tem cliente cadastrado
        // com esse telefone

        if(await Client.findOne({ 'contact': contact }, function (err){
            if (err){
                return res.status(400).send({
                    message: 'error connecting to the db.'
                });
            }; 
        })) return res.status(400).send({
                message: 'contact already registered. try another.'
        });

        // cria o cliente passando o
        // id e nome de quem criou

        const client = await Client.create(req.body);
        client.createdBy = req.userId;
        client.save();

            // logs de registro
        var date = new Date();
        console.log(date.getHours()+
            ':'+date.getMinutes()+
            ':'+date.getSeconds()+
            ' | cliente '+client.name+' cadastrado(a) 🤸'
        );


        return res.send({ client })
        
    } catch (err) {
        return res.status(400).send({
            message: 'create client is not possible.'
        })
    }
})

router.put('/:clientId', async (req, res) => {
    
    const { contact } = req.body;
   
    // verifica se ja tem algum contato registrado
    // antes de prosseguir
    if (contact){
        if(await Client.findOne({contact}))
            return res.status(400).send({
                message: 'contact already registered. try another.'
        });
    }

    try {
        // atualiza as informacoes dos clientes
        const client = await Client.findByIdAndUpdate(
            req.params.clientId,
            {$set: req.body},
            {new: true, useFindAndModify: false},
            (err) =>{
                if (err)
                    return res.status(400).send({
                        message: 'failed to update. Is the correct id?',
                        error: err
                });
            }
        );

        client.save();
        return res.send({ client });
    } catch (err) {
        console.log(err);
        res.status(400).send({
            message: 'cannot update client.'
        });
    }
})

router.delete('/:clientId', async (req, res) => {
    try {
        await Client.findByIdAndRemove(req.params.clientId, {useFindAndModify: false});

        res.send({
            message: 'client removed.'
        })
        
    } catch (err) {
        res.status(400).send({
            message: 'cannot generate client list.'
        });
    }   
})




module.exports = app => app.use('/clients', router);
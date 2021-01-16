const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
    var date = new Date();
    console.log(date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+' | Tivemos um acesso 👀');
    next();
})

router.get('/', (req, res) => {
    res.send(req.body)
})

router.post('/', (req, res) => {
    res.send("fala meu peixe. Tu ta no post.")
})

router.put('/', (req, res) => {
    res.send("edit me")
})

router.delete('/', (req, res) => {
    res.send("deletou o nego")
})


module.exports = router;
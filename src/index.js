const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// setting body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// passando app como parametro para os controllers
// controllers sao automaticamente adicionados
require('./app/controllers/index')(app);


// run api 🔥🔥🔥🔥🔥

app.listen(3001, () =>{
    console.log("🔥 Server listen on port 3001 🔥")
})
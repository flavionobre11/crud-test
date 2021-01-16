const express = require('express')
const bodyParser = require('body-parser')

const app = express()


// setting body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('./controllers/auth')(app);
require('./controllers/tokenController')(app);

// // instance routes
// const employerRoute = require(__dirname+'/src/route/employer.js')

// app.use('/employer', employerRoute);

// app.get('/', (req, res) =>{
//     res.send(req.body)
// })

// app.get('/listar', (req, res) =>{
//     res.send(req.body)
// })


app.listen(3001, () =>{
    console.log("🔥 Server listen on port 3001 🔥")
})
const fs = require('fs')
const path = require('path')

module.exports = app => {
    fs
        .readdirSync(__dirname) // pega pasta atual
        .filter(file => ( // filtro por: nomes que nao comecam com "." e nao se chamam "index.js"
            (file.indexOf('.')) !== 0 && (file !== "index.js")
        )) 
        .forEach(file => require(path.resolve(__dirname, file))(app)) // passando app como parametro para todos os arquivos
};
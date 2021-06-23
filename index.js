const express = require('express')
const app = express()
const connect_database = require('./databases/database')
const pergunta_model = require('./databases/pergunta')
//conexao database

connect_database.authenticate()
.then(()=>{
    console.log('connection successful on database')
})
.catch((err) =>{
    console.log(`connection not successful on database ${err}`)
})
// usando o express com o EJS como engine
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

//rotas
app.get('/', (req,res) => {
    res.render('index')
})
app.get('/perguntar', (req, res) =>{
    res.render('perguntar')
})
app.post('/salvar-pergunta', (req, res) =>{
    var titulo = req.body.titulo
    var descricao = req.body.descricao

})




app.listen(8080, ()=> {
    console.log("listening on app ")
})

const express = require('express')
const app = express()
const connect_database = require('./databases/database')
const Pergunta = require('./databases/pergunta')
const Resposta = require('./databases/resposta')

//conexao database

connect_database.authenticate()
    .then(() => {
        console.log('connection successful on database')
    })
    .catch((err) => {
        console.log(`connection not successful on database ${err}`)
    })
// usando o express com o EJS como engine
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//rotas
app.get('/', (req, res) => {
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then(perguntas => {
        res.render('index', {
            perguntas: perguntas
        })
    })
})
app.get('/perguntar', (req, res) => {
    res.render('perguntar')
})
app.post('/salvar-pergunta', (req, res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/')
    })

})

//rota para pegar os valores do database
app.get('/pergunta/:id', (req, res) => {
    var id = req.params.id
    Pergunta.findOne({
        where: { id: id }
    }).then(pergunta => {
        if (pergunta != undefined) { //pergunta encontrada?

            Resposta.findAll({ // recebendo as perguntas do banco de dados
                where: {
                    perguntaId: pergunta.id
                },
                order: [
                    ['id', 'desc']
                ]
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })

            res.render('pergunta', {
                pergunta: pergunta
            })
        } else { // pergunta não encontrada
            throw new TypeError(`
            Não foi possivel encontrar a sua pergunta!
            `)
        }
    })
})

app.post('/responder', (req, res) => {
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect(`/pergunta/${perguntaId}`)
    })
})



app.listen(8080, () => {
    console.log("listening on app ")
})

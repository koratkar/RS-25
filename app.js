//jshint esversion:8, asi: true
//rs-25 is the name of a rocket engine

let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let ejs = require('ejs')
let { Client } = require('pg')
let fs = require('fs')
const { checkServerIdentity } = require('tls')
const { response } = require('express')

let client = new Client({
    user: 'postgres',
    hostname: 'localhost',
    database: 'kittyvote',
    port: 5432,
})

client.connect()

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', ejs)
app.use(express.static('kittens'))
app.use(bodyParser.json())

function getpics() {
    let k = fs.readdirSync(__dirname + "/kittens", "utf8")
    return k.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item))
}

function addme() {
    let k = getpics()
    for (i = 0; i<k.length; i++) {
        let image = k[i]
        let text = 'INSERT INTO catballot(img, score) VALUES ($1, $2) RETURNING *'
        let values = [image, 1]
        client.query(text, values, (err, response) => {
            if (err) {
                console.log(err)
                return
            } 
            console.log('insert succesful')
        })
    }
}

function update(pic) {
    let text = `UPDATE catballot SET score = score + 1 WHERE img = $1;`
    let a = [pic]
    client.query(text, a, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.log('update succesful')
        }
    })
}

app.get('/', (req, res) => {
    let k = getpics()
    let check = function (ri1, ri2) {
        if (ri1 == ri2) {
            return check(k[Math.floor(Math.random() * k.length)], i2)
        } else {
            let data = {
                image: ri1,
                image2: ri2
            }
            return res.render('vote.ejs', data)
        }
    }
    let i1 = k[Math.floor(Math.random() * k.length)]
    let i2 = k[Math.floor(Math.random() * k.length)]
    check(i1, i2)
})

app.post('/', (req, res) => {
    update(req.body.vote)
    res.redirect('/')
})

addme()

app.listen(3000, () => {
    console.log("port 3000. alive. cool.")
})

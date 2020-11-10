//jshint esversion:8, asi: true
//basically the site engine for my new webcomic
//rs-25 is the name of a rocket engine
//and I said biiiiiitch.

let app = require('express')()
let bodyParser = require('body-parser')
let fs = require('fs')

function songscan() {
    let songs = fs.readdirSync(__dirname + "/songs", "utf8")
    return songs.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item))
}

function recursive(arr, string, n) {
    if (n == arr.length) {
        return string
    } else {
        let astr = "then" + arr[n]
        let en = n + 1
        recursive(arr, astr, en)
    }
}

app.get('/', (req, res) => {

    res.send()
})

app.listen(3000, () => {
    console.log("port 3000. alive. cool.")
    console.log(recursive(["hee", "feeq", "beeeq", "hexagon"], "", 0))
})


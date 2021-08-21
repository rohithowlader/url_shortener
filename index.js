import express from 'express'
import redis from 'async-redis'
import exphbs from 'express-handlebars'

const client = redis.createClient()

client.on('connect', () => {console.log('Redis server ready')})

const app = express()
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.engine('handlebars', exphbs({
    defaultLayout: false
}))
app.set('view engine', 'handlebars')

const makeid = async(length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

app.listen(5000, () => {console.log('Server started')})
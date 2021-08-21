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

app.post('/short', async(req, res) => {
    const isValid = await checkUrl(req.body.url)
    if(!isValid) {
        return res.status(500).send("Incorrect input")
    }

    const newUrl = await makeid(8) //generate new url
    const isPresent = await client.get(newUrl) //check collision for random id
    const isUrlPresent = await client.get(req.body.url) //check if url already generated

    if(isUrlPresent) {
        return res.render('url', {url: `http://localhost:5000/s/${isUrlPresent}`})
    }
    if (!isPresent) {
        await client.set(newUrl, req.body.url, 'EX', 3600)    
        await client.set(req.body.url, newUrl, 'EX', 3600)

        return res.render('url', {url: `http://localhost:5000/s/${newUrl}`})
    }
})

app.get('/', (req, res) => {
    res.render('home')
})

app.listen(5000, () => {console.log('Server started')})
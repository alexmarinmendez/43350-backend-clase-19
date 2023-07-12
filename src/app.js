import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import handlebars from 'express-handlebars'

const app = express()

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017',
        dbName: 'clase19',
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret: 'victoriasecret',
    resave: true,
    saveUninitialized: true
}))

app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

const auth = (req, res, next) => {
    if (req.session?.user && req.session.user.username === 'admin@coderhouse.com') {
        return next()
    }
    return res.status(401).json({ status: 'fail', message: 'Auth error' })
}

app.get('/', (req, res) => res.json({ status: 'success', message: 'Que la fueza te acompañe!' }))

app.get('/products', auth, (req, res) => {
    //lectura de los prodyctos de la bd
    const products = [{ name: 'coca cola'}, { name: 'pepsi' }]
    res.render('products', {
        username: req.session.user.username,
        products: products
    })
})


app.get('/user/profile', (req, res) => {
    const user = {
        username: 'admin@coderhouse.com',
        ui_preference: 'dark',
        language: 'es',
        location: 'pe'
    }
    // res.cookie('preference', JSON.stringify(user), {signed: true}).json({ status: 'success', message: 'Cookie creada!' })
    req.session.user = user
    res.json({ status: 'success', message: 'Session creada!' })
})

app.get('/user/getpreference', (req, res) => {
    res.send(req.session.user.username)
})

app.get('/user/deletepreference', (req, res) => {
    // res.clearCookie('preference').json({ status: 'success', message: 'Cookie deleteada!' })
    req.session.destroy(err => {
        if (err) return res.json({ status: 'error', message: 'Ocurrio un error' })
        return res.json({ status: 'success', message: 'Cookie deleteada!' })
    })
})

app.listen(8080, () => console.log('Server Up'))
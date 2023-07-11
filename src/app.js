import express from 'express'
import session from 'express-session'

const app = express()
app.use(session({
    secret: 'victoriasecret',
    resave: true,
    saveUninitialized: true
}))

app.get('/', (req, res) => res.json({ status: 'success', message: 'Que la fueza te acompañe!' }))
app.get('/user/profile', (req, res) => {
    const user = {
        username: 'alexmarinmendez',
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
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const body_parser = require('body-parser')
// const cors = require('cors')

const db = require('./db/connection')
const { query } = require('./db/query')

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.text({ type: '*/*' }));

db.connect()

app.get('/user', (req, res) => {
    query.get(db, response => {
        res.send(response)
    })
})

app.post('/user', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashedPassword

        query.add(db, {
            user: req.body
        }, response => {
            res.send(response)
        })
    } catch(e) {
        res.send('Error has occur')
    }
})

app.put('/user/:id', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashedPassword

        query.update(db, {
            id: req.params.id,
            user: req.body
        }, response => {
            res.send(response)
        })
    } catch(e) {
        res.send('Error has occur')
    }
})

app.delete('/user/:id', (req, res) => {
    // this process will allow to remove single or multiple users
    // the parameter must be a string separated by a comma(,)
    var ids = req.params.id.split(',')

    query.delete(db, {
        userIDs: ids
    }, function(response) {
        res.send(response)
    })
})

app.post('/user/login', (req, res) => {
    query.get(db, async response => {
        const user = response.find(user => user.username = req.body.username)
        if (user == null || user == undefined) {
            return res.send('Cannot find user')
        }

        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                query.updateStatus(db, {
                    id: user.id
                }, statusResponse => {
                    res.send(statusResponse)
                })
            } else {
                res.send('Incorrect password')
            }
        } catch(e) {
            res.status(500).send()
        }
    })
})

app.use(express.json())
app.listen(8000)

// for testing ...
module.exports = {
    query,
    app,
    db,
    bcrypt
}

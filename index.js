require('dotenv').config()

const express = require('express')
const app = express()
const mysql = require('mysql')
const fs = require('fs')

app.use(express.json())

// Connect to database
const connection = mysql.createConnection({
	host: process.env.TYPEORM_HOST,
	user: process.env.TYPEORM_USERNAME,
	password: process.env.TYPEORM_PASSWORD,
	database: process.env.TYPEORM_DATABASE,
	multipleStatements: true
})

connection.connect(() => {
    // Read SQL seed query
    const seedQuery = fs.readFileSync('./crud.sql', {
        encoding: 'utf-8'
    });

    // check if seed already completed
    connection.query('SHOW tables', function(err, tables) {
        if (err) {
            throw err;
        }

        if (tables.length === 0) {
            // Run seed query
            connection.query(seedQuery, (error) => {
                if (error) {
                    throw error;
                }

                console.log('SQL seed completed!');
                connection.end();
            })
        } else {
            console.log('Seed already completed.')
        }
    })
})

var users = [
    {
        id: '1',
        firstname: 'John',
        lastname: 'Doe',
        address: 'California',
        postcode: '6000',
        contact: '123456789',
        email: 'john.doe@gmail.com',
        username: 'john',
        password: 'john123'
    }
]

app.post('/user/login', (req, res) => {
    var username = req.body.username
    var password = req.body.password

    var authUser = users.find(user => user.username == username && user.password == password)
    if (authUser) {
        res.send({
            authenticationSucess: true,
            messsage: 'Login successfullly',
            data: authUser
        })
    } else {
        res.send({
            authenticationSucess: false,
            messsage: 'User not found'
        })
    }
})

app.get('/user', (req, res) => {
    res.send({
        success: true,
        messsage: 'data fetched successfully',
        data: res[0]
    })
})

app.post('/user', (req, res) => {
    if (JSON.stringify(req.body) !== '{}') {
        users.push({
            id: (users.length + 1).toString(),
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: req.body.address,
            postcode: req.body.postcode,
            contact: req.body.contact,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        })
        res.send({
            sucess: true,
            messsage: 'data added successfully'
        })
    } else {
        res.send({
            sucess: false,
            messsage: 'validation error',
            errors: [
                {
                    data: 'request',
                    message: 'cannot be undefined'
                }
            ]
        })
    }
})

app.delete('/user/:id', (req, res) => {
    // this process will allow to remove single or multiple users
    var ids = req.params.id.split(',')
    ids.forEach(item => {
        users = users.filter(user => user.id != item)
    })

    res.send({
        sucess: true,
        messsage: 'data deleted successfully'
    })
})

app.put('/user/:id', (req, res) => {
    var id = req.params.id
    var index = users.findIndex(user => user.id == id)

    users[index] = {
        ...users[index],
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
        postcode: req.body.postcode,
        contact: req.body.contact,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }

    res.send({
        sucess: true,
        messsage: 'data updated successfully'
    })
})

app.listen(8000)


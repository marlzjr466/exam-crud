const fs = require('fs')

const connection = require('./connection')

connection.connect(()=> {
    // Read SQL seed query
    const seedQuery = fs.readFileSync('./db/crud.sql', {
        encoding: 'utf-8'
    });
    // Run seed query
    connection.query(seedQuery, (error) => {
        if (error) {
            throw error;
        }

        console.log('SQL seed completed.');
        connection.end();
    })
})

const fs = require('fs')

const seeding = {
    init: (connection, callback) => {
        // Read SQL seed query
        const seedQuery = fs.readFileSync('./db/crud.sql', {
            encoding: 'utf-8'
        });
    
        // check if seed already completed
        connection.query('SHOW tables', (err, tables) => {
            if (err) {
                throw err;
            }
    
            if (tables.length === 0) {
                // Run seed query
                connection.query(seedQuery, (error) => {
                    if (error) {
                        throw error;
                    }
    
                    callback('SQL seed completed.');
                    connection.end();
                })
            } else {
                callback('SQL seed completed.')
            }
        })
    }
}

module.exports = seeding


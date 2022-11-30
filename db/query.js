const query = {
    get: (connection, callback) => {
        // select all users except for the admin
        connection.query('SELECT * FROM user WHERE id > ?', [1], (err,res) => {
            if (err) {
                throw err
            }

            return callback(res)
        })
    },

    add: (connection, req, callback) => {
        let values = [
            [req.user.firstname, req.user.lastname, req.user.address, req.user.postcode, req.user.contact, req.user.email, req.user.username, req.user.password]
        ]
        connection.query('INSERT INTO user(firstname, lastname, address, postcode, phone, email, username, password) VALUES ?', [values], (err, res) => {
            if (err) {
                throw err;
            }

            return callback('New user registered')
        })
    },

    update: (connection, req, callback) => {
        let qry = `UPDATE user SET firstname=?, lastname=?, address=?, postcode=?, phone=?, email=?, username=?, password=? WHERE id=?`
        connection.query(qry, [req.user.firstname, req.user.lastname, req.user.address, req.user.postcode, req.user.contact, req.user.email, req.user.username, req.user.password, req.id], (err,res) => {
            if (err) {
                throw err
            }

            return callback('User info updated')
        })
    },

    delete: (connection, req, callback) => {
        connection.query('DELETE FROM user WHERE id IN ('+ req.userIDs.toString() +')', (err,res) => {
            if (err) {
                throw err
            }

            return callback('Selected users deleted successfully')
        })
    },

    updateStatus: (connection, req, callback) => {
        connection.query('UPDATE user SET status = 1 WHERE id = ?', [req.id], (err,res) => {
            if (err) {
                throw err
            }

            query.get(connection, response => {
                return callback({
                    message: 'User authenticated',
                    data: response[0]
                })
            })
        })
    }
}

module.exports = { query }
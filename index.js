const express = require('express')
const db = require('./middleware/database-middleware')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
app.use(bodyParser.json())


const apiResponse = function (data, error) {
    if (error) {
        return {
            success: false,
            error: error
        }
    }

    return {
        success: true,
        data: data
    }
}

const query = (query, values) => {
    return new Promise((resolve, reject) => {
        db.query(query, values, (err, result, fields) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

// API

app.get('/home', (req, res) => {
    res.send('HOME PAGE')
})

// REGISTER USER

app.post('/register', async (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO user (username, password, email, role) VALUES (?, ?, ?, ?)';
        db.query(query, [username, hashedPassword, email, role], (err, result) => {
            if (err) {
                console.error('Registration failed:', err);
                res.status(500).json({ message: 'Registration failed' });
            } else {
                res.status(201).json({ message: 'Registration successful' });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

//  Get All Registered User
app.get('/register/user', (request, response) => {
    db.query("select * from user", (err, result, fields) => {
        if (err) {
            console.error(err)
            response.status(500).json(apiResponse(null, "server error"))
            response.end()
            return
        }

        response.status(200).json(apiResponse(result, null))
        response.end()
    })
})

// LOGIN

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const query = 'SELECT * FROM user WHERE username = ?';
        db.query(query, [username], async (err, result) => {
            if (err) {
                console.error('Login failed:', err);
                res.status(500).json({ message: 'Login failed' });
            } else if (result.length === 1) {
                const user = result[0];
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
                    const token = jwt.sign({ userId: user.id, role: user.role }, 'your-secret-key', { expiresIn: '1h' });
                    res.json({ token });
                } else {
                    res.status(401).json({ message: 'Authentication failed' });
                }
            } else {
                res.status(401).json({ message: 'Authentication failed' });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

// CRUD

// Get All Data Nama stok barang

app.get('/datas', (request, response) => {
    db.query("select * from nama_stokbarang ", (err, result, fields) => {
        if (err) {
            console.error(err)
            response.status(500).json(apiResponse(null, "server error"))
            response.end()
            return
        }

        response.status(200).json(apiResponse(result, null))
        response.end()
    })
})


// Get All Data stok_masuk

app.get('/datas/in', (request, response) => {
    db.query("select * from stok_masuk", (err, result, fields) => {
        if (err) {
            console.error(err)
            response.status(500).json(apiResponse(null, "server error"))
            response.end()
            return
        }

        response.status(200).json(apiResponse(result, null))
        response.end()
    })
})

// Get stok_barang by ID

app.get('/datas/:id', (request, response) => {
    const id = request.params.id
    db.query(`select 
            b.id, b.nama_barang, b.merek, sum(m.jumlah) as total_stok
        from 
            nama_stokbarang as b
            left join stok_masuk as m on b.id = m.id_barang
        where 
            b.id = ?
        group by 
            b.id`, id, (err, result, fields) => {
        if (err) {
            console.error(err)
            response.status(500).json(apiResponse(null, "server error"))
            response.end()
            return
        }

        response.status(200).json(apiResponse(result, null))
        response.end()
    })
})

// Post nama_stokbarang

app.post('/datas/stok', (request, response) => {
    const body = request.body
    db.query(`
        insert into 
            nama_stokbarang (nama_barang, merek) 
        values 
            (?,?)`, [body.nama_barang, body.merek], (err, result, fields) => {
        if (err) {
            console.error(err)
            response.status(500).json(apiResponse(null, "server error"))
            response.end()
            return
        }

        response.status(200).json(apiResponse({ id: result.insertId }, null))
        response.end()
    })
})

// Post stok_masuk

app.post('/datas/stok/in', (request, response) => {
    const body = request.body
    db.query(`
        insert into 
            stok_masuk (id_barang, jumlah, nama_barang) 
        values 
            (?,?,?)`, [body.id_barang, body.jumlah, body.nama_barang], (err, result, fields) => {
        if (err) {
            console.error(err)
            response.status(500).json(apiResponse(null, "server error"))
            response.end()
            return
        }

        response.status(200).json(apiResponse({ id: result.insertId }, null))
        response.end()
    })
})

// Delete stok_masuk by ID

app.delete('/datas/stok/:id', (request, response) => {
    const id = request.params.id
    db.query(`delete from stok_masuk where id = ?`, id, (err, result, fields) => {
        if (err) {
            console.error(err)
            response.status(500).json(apiResponse(null, "server error"))
            response.end()
            return
        }

        if (result.affectedRows == 0) {
            response.status(404).json(apiResponse(null, "datas not found"))
            response.end()
            return
        }

        response.status(200).json(apiResponse({ id: id }, null))
        response.end()
    })
})



app.listen(process.env.PORT, () => {
    console.log("Server is Running on Port: " + process.env.PORT)
})
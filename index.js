const express = require('express')
const cors = require('cors')
const mysql = require('mysql')

const app = express()
const PORT = process.env.PORT

const SELECT_ALL_APPOINTMENTS_QUERY = 'SELECT * FROM appointment'

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'digitale_agenda'
})

connection.connect(err => {
    if (err) {
        return err
    }
})

console.log(connection)

app.use(cors())

app.get('/', (req, res) => {
    res.send('Go to /appointments for all appointments <br> Go to /appointments_client?client_id=(int) for appointments of client')
})

//Clienten

app.get('/appointments', (req, res) => {
    connection.query(SELECT_ALL_APPOINTMENTS_QUERY, (err, results) => {
        if (err) {
            return res.send(err)
        } else {
            return res.json({
                day1: results
            })
        }
    })
})

app.get('/appointments_client', (req, res) => {
    const { client_id } = req.query
    const SELECT_APPOINTS_CLIENT_QUERY = `SELECT appointment.description, appointment.date, appointment.time, picto.name FROM accountClient_has_appointment INNER JOIN appointment ON accountClient_has_appointment.afspraak_idafspraak = appointment.idappointment INNER JOIN accountClient ON accountClient_has_appointment.accountClient_idaccountClient = accountClient.idaccountClient INNER JOIN picto ON appointment.Picto_idPicto = picto.idPicto WHERE accountClient.idaccountClient = '${client_id}' HAVING date BETWEEN CURDATE() AND DATE(CURDATE()+7) ORDER BY date, time;`
    connection.query(SELECT_APPOINTS_CLIENT_QUERY, (err, results) => {
        if (err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    })
})

//Familie en Begeleiders

// app.get('/products/add', (req, res) => {
//     const { name, price } = req.query
//     const INSERT_PRODUCTS_QUERY = `INSERT INTO products (name, price) VALUES('${name}', '${price}')`
//     const QUERY =
//         connection.query(INSERT_PRODUCTS_QUERY, (err, results) => {
//             if (err) {
//                 return res.send(err)
//             } else {
//                 return res.send('good')
//             }
//         })
// })
app.listen(PORT)
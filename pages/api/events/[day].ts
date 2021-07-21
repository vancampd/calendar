let mysql = require('mysql')

let con = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'rootroot',
    database: 'calendar'
})

con.connect((err)=>{
    if(err) return console.log('Error connecting to database', err)
    console.log('Connected to the MySQL Server!')
})

export default function handler(req, res){
    console.log(req.body)
    const { description, type, day, month, year } = req.body

    const sql = `INSERT INTO calendar.calendar_items (day, month, year, description, type) VALUES (${day}, ${month}, ${year}, '${description}', '${type}')`;


    con.query(sql, (err, result) => {
        if(err) return console.log('Error inserting data', err)
        res.status(200).send(result)
    })
        
    
}
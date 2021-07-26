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
    if(req.method==='GET'){
        const {month, year} = req.body
        const sql = `SELECT id, day, month, year, description, type FROM calendar.calendar_items`

        con.query(sql, (err, result) => {
            const resultObjects = result.map(event => {
                return {
                    id: event.id,
                    day: event.day,
                    month: event.month,
                    year: event.year,
                    description: event.description, 
                    type: event.type
                }
            })
            res.status(200).json(resultObjects)
        })
    }  
}
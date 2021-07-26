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
    if(req.method === 'POST'){
        const { description, type, day, month, year, time, timeOfDay } = req.body

        const sql = `INSERT INTO calendar.calendar_items (day, month, year, description, type, time, timeOfDay) VALUES (${day}, ${month}, ${year}, '${description}', '${type}', '${time}', '${timeOfDay}')`;

        con.query(sql, (err, result) => {
            if(err) return console.log('Error inserting data', err)
            res.status(200).send(result)
        }) 
    }

    if(req.method==='GET'){
        const {day} = req.query
        const [m, d, yyyy] = day.split('-')

        const sql = `SELECT id, description, type, time, timeOfDay FROM calendar.calendar_items WHERE day='${d}' AND month ='${m - 1}' AND year='${yyyy}'`

        con.query(sql, (err, result) => {
            if(err) return console.log('Error inserting data', err)
            
            const resultObjects = result.map(event => {
                return {
                    id: event.id,
                    description: event.description, 
                    type: event.type,
                    time: event.time,
                    timeOfDay: event.timeOfDay
                }
            })
            res.status(200).json(resultObjects)
        })
    }
    
    if(req.method === 'DELETE'){
        const {id} = req.body

        const sql = `DELETE FROM calendar.calendar_items WHERE id = '${id}'`

        con.query(sql, (err, result) => {
            if(err) return console.log('Error inserting data', err)
            
            res.status(200).json(result)
        })
        
    } 
    
}
let mysql = require('mysql')

let con = mysql.createConnection({
    host: 'calendar.cvt54lronztd.us-east-2.rds.amazonaws.com',
    user: 'dvc',
    password: 'MarleyGirl3',
    database: ''
})

// let con = mysql.createConnection({
//     host: '127.0.0.1',
//     user: 'root',
//     password: 'rootroot',
//     database: 'calendar'
// })

con.connect((err: any)=>{
    if(err) return console.log('Error connecting to database', err)
    console.log('Connected to the MySQL Server!')
})

export default async function handler(req:any, res:any){

    if(req.method === 'POST'){
        const { description, type, day, month, year, time, timeOfDay } = req.body

        let sql:string = '';

        if(type === 'event') sql = `INSERT INTO sys.calendar_items (day, month, year, description, type, time, timeOfDay) VALUES (${day}, ${month}, ${year}, '${description}', '${type}', '${time}', '${timeOfDay}')`;

        if(type === 'task') sql = `INSERT INTO sys.calendar_items (day, month, year, description, type) VALUES (${day}, ${month}, ${year}, '${description}', '${type}')`;

        // if(type === 'event') sql = `INSERT INTO calendar.calendar_items (day, month, year, description, type, time, timeOfDay) VALUES (${day}, ${month}, ${year}, '${description}', '${type}', '${time}', '${timeOfDay}')`;

        // if(type === 'task') sql = `INSERT INTO calendar.calendar_items (day, month, year, description, type) VALUES (${day}, ${month}, ${year}, '${description}', '${type}')`;

        con.query(sql, (err:any, result:any) => {
            if(err) return console.log('Error inserting data', err)
            res.status(200).send(result)
        }) 
    }

    if(req.method === 'PUT'){
        const { description, type, time, timeOfDay, id } = req.body

        const sql = `UPDATE sys.calendar_items SET description='${description}', type='${type}', time='${time}', timeOfDay='${timeOfDay}' WHERE id='${id}'`;

        // const sql = `UPDATE calendar.calendar_items SET description='${description}', type='${type}', time='${time}', timeOfDay='${timeOfDay}' WHERE id='${id}'`;

        con.query(sql, (err:any, result:any) => {
            if(err) return console.log('Error inserting data', err)
            res.status(200).send(result)
        }) 
    }

    if(req.method==='GET'){
        const {day} = req.query
        const [m, d, yyyy] = day.split('-')

        const sql = `SELECT id, description, type, time, timeOfDay FROM sys.calendar_items WHERE day='${d}' AND month ='${m - 1}' AND year='${yyyy}'`

        // const sql = `SELECT id, description, type, time, timeOfDay FROM calendar.calendar_items WHERE day='${d}' AND month ='${m - 1}' AND year='${yyyy}'`

        con.query(sql, (err:any, result:any) => {
            if(err) return console.log('Error inserting data', err)
            
            const resultObjects = result.map((event:any) => {
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

        const sql = `DELETE FROM sys.calendar_items WHERE id = '${id}'`

        // const sql = `DELETE FROM calendar.calendar_items WHERE id = '${id}'`

        con.query(sql, (err:any, result:any) => {
            if(err) return console.log('Error inserting data', err)
            
            res.status(200).json(result)
        })
        
    } 
    
}
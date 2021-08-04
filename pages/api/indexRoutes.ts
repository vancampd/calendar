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

con.connect((err:any)=>{
    if(err) return console.log('Error connecting to database', err)
    console.log('Connected to the MySQL Server!')
})

export default async function handler(req:any, res:any){

    if(req.method==='GET'){
        const {month, year} = req.body
        const sql = `SELECT id, day, month, year, description, type FROM sys.calendar_items`
        // const sql = `SELECT id, day, month, year, description, type FROM calendar.calendar_items`

        con.query(sql, (err:any, result:any) => {
            const resultObjects = result.map((event:any) => {
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
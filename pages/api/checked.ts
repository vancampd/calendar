let mysql = require('mysql')

let con = mysql.createConnection({
    host: 'database-1.cvt54lronztd.us-east-2.rds.amazonaws.com',
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

con.connect((err)=>{
    if(err) return console.log('Error connecting to database', err)
    console.log('Connected to the MySQL Server!')
})

export default function handler(req, res){
    if(req.method === 'PUT'){
        const { checked, id } = req.body

        if(checked){
            const sql = `INSERT INTO sys.checked_items (item_id) VALUES ('${id}')`;
            // const sql = `INSERT INTO calendar.checked_items (item_id) VALUES ('${id}')`;

            con.query(sql, (err, result) => {
                if(err) return console.log('Error inserting data', err)
                return res.status(200).send(result)
            })
        }

        if(!checked){
            const sql = `DELETE FROM sys.checked_items WHERE item_id = '${id}'`;
            // const sql = `DELETE FROM calendar.checked_items WHERE item_id = '${id}'`;

            con.query(sql, (err, result) => {
                if(err) return console.log('Error inserting data', err)
                return res.status(200).send(result)
            })
        }
    }

    if(req.method === 'GET'){
        const sql = `SELECT item_id FROM sys.checked_items`;
        // const sql = `SELECT item_id FROM calendar.checked_items`;

        con.query(sql, (err, result) => {
            if(err) return console.log('Error inserting data', err)
            return res.status(200).send(result)
        })

    }
}
import {connection} from '../../config/database-config'

let mysql = require('mysql')

let con = mysql.createConnection(connection)

con.connect((err: any)=>{
    if(err) return console.log('Error connecting to database', err)
    console.log('Connected to the MySQL Server!')
})

export default async function handler(req: any, res: any){

    if(req.method === 'PUT'){
        const { checked, id } = req.body

        if(checked){
            const sql = `INSERT INTO sys.checked_items (item_id) VALUES ('${id}')`;

            con.query(sql, (err: any, result: any) => {
                if(err) return console.log('Error inserting data', err)
                return res.status(200).send(result)
            })
        }

        if(!checked){
            const sql = `DELETE FROM sys.checked_items WHERE item_id = '${id}'`;

            con.query(sql, (err: any, result: any) => {
                if(err) return console.log('Error inserting data', err)
                return res.status(200).send(result)
            })
        }
    }

    if(req.method === 'GET'){
        const sql = `SELECT item_id FROM sys.checked_items`;

        con.query(sql, (err: any, result: any) => {
            if(err) return console.log('Error inserting data', err)
            return res.status(200).send(result)
        })

    }
}
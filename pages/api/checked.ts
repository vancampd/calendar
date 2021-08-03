import Cors from 'cors'
import type { NextApiRequest, NextApiResponse } from 'next'

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'PUT'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result:any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

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

con.connect((err: any)=>{
    if(err) return console.log('Error connecting to database', err)
    console.log('Connected to the MySQL Server!')
})

export default async function handler(req: any, res: any){

    await runMiddleware(req, res, cors)

    if(req.method === 'PUT'){
        const { checked, id } = req.body

        if(checked){
            const sql = `INSERT INTO sys.checked_items (item_id) VALUES ('${id}')`;
            // const sql = `INSERT INTO calendar.checked_items (item_id) VALUES ('${id}')`;

            con.query(sql, (err: any, result: any) => {
                if(err) return console.log('Error inserting data', err)
                return res.status(200).send(result)
            })
        }

        if(!checked){
            const sql = `DELETE FROM sys.checked_items WHERE item_id = '${id}'`;
            // const sql = `DELETE FROM calendar.checked_items WHERE item_id = '${id}'`;

            con.query(sql, (err: any, result: any) => {
                if(err) return console.log('Error inserting data', err)
                return res.status(200).send(result)
            })
        }
    }

    if(req.method === 'GET'){
        const sql = `SELECT item_id FROM sys.checked_items`;
        // const sql = `SELECT item_id FROM calendar.checked_items`;

        con.query(sql, (err: any, result: any) => {
            if(err) return console.log('Error inserting data', err)
            return res.status(200).send(result)
        })

    }
}
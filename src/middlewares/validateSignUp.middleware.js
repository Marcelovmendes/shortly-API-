import {db} from "../database/database.connection.js";

export const validateSignUp = (req, res, next) => {
   const {email} = req.body
const userEmailExists = db.query('SELECT * FROM users WHERE email = $1', [email])
if(userEmailExists) return res.status(409).send({ message: "Conflict" }); 
next()
}
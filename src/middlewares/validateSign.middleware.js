import {db} from "../database/database.connection.js";
import bycript from "bcrypt";

export async function validateSignUp (req, res, next) {
   const {email} = req.body

const userEmailExists = await db.query('SELECT * FROM users WHERE email = $1', [email])
console.log(userEmailExists.rowCount)
if(userEmailExists.rowCount !== 0) return res.status(409).send({ message: "Conflict" }); 
next()
}

export async function validateSign (req,res,next){
 const {email,password} = req.body
 
  const user = await db.query('SELECT * FROM users WHERE email = $1', [email])
  console.log(user)
  if(!user || user.rows.length===0) return res.status(401).send({ message: "Unauthorized" })
  const passwordMatch = bycript.compareSync(password, user.rows[0].password)
  if(!passwordMatch) return res.status(401).send({ message: "Unauthorized" })

  res.locals.user = user.rows[0]
   next()
}

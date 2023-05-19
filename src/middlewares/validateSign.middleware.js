import {db} from "../database/database.connection.js";

export async function validateSignUp (req, res, next) {
   const {email} = req.body
const userEmailExists = db.query('SELECT * FROM users WHERE email = $1', [email])
if(userEmailExists) return res.status(409).send({ message: "Conflict" }); 
next()
}

export async function validateSign (req,res,next){
 const {email,password} = req.body

  const user = await db.query('SELECT * FROM users WHERE email = $1', [email])
  if(!user || user.rows.length===0) return res.status(401).send({ message: "Unauthorized" })
  const passwordMatch = bycript.compareSync(password, user.password)
  if(!passwordMatch) return res.status(401).send({ message: "Unauthorized" })

  res.locals.user = user.rows[0]
   next()
}

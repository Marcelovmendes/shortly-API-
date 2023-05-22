import {db} from "../database/database.connection.js";
export async function validateShorten(req,res,next){
    const {authorization} = req.headers

    const token = authorization?.replace("Bearer ", "")
    
    if(!token) return res.status(401).send({ message: "Unauthorized" })

    const session = await db.query('SELECT * FROM sessions WHERE token = $1', [token])
    if(session.rows.length===0) return res.status(401).send({ message: "Not Found" })
    
    res.locals.session = session.rows[0].userId
    next()
}
export async function validateDeleteShorten( req,res,next){
  const {authorization} = req.headers
  const {id} = req.params 
  const token = authorization?.replace("Bearer ", "")
  if(!token) return res.status(401).send({ message: "Unauthorized" })

  const session = await db.query('SELECT * FROM sessions WHERE token = $1', [token])
  if(session.rows.length===0) return res.status(401).send({ message: "Session Not Found" })
const {userId} = session.rows[0]
console.log(userId,"userId")
console.log(id,"id")
  const userToken = await db.query(`SELECT urls.id,urls."userId" from urls WHERE "id"=$1 AND "userId"=$2` , [id, userId])
 console.log(userToken,"userTOken")
if( userToken.rows[0] === undefined) return res.status(401).send({ message: " unauthorized" })
  res.locals.userId= userToken.rows[0].userId

  next()
}
export async function ValidategetUser(req,res,next){
   const {authorization} = req.headers
   const token = authorization?.replace("Bearer ", "")
   if(!token) return res.status(401).send({ message: "Unauthorized" })
   const session = await db.query('SELECT * FROM sessions WHERE token = $1', [token])
   if(session.rows.length===0) return res.status(401).send({ message: "Session Not Found" })
   
   const userId= session.rows[0].userId
   console.log(userId,"userId")
  res.locals.userId= userId
   next()


}
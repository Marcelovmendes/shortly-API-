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
export async function validateGetUserShorten( req,res,next){
  const {authorization} = req.headers
  const {id} = req.params 
  const token = authorization?.replace("Bearer ", "")
  if(!token) return res.status(401).send({ message: "Unauthorized" })

  const session = await db.query('SELECT * FROM sessions WHERE token = $1', [token])
  if(session.rows.length===0) return res.status(401).send({ message: "Session Not Found" })

  const userToken = await db.query(`SELECT url."userId" url."id" from urls WHERE "userId"=$1 AND  "id"=$2` , [userId], [id])

  if( userToken.rows[0] === undefined) return res.status(401).send({ message: " unauthorized" })
  res.locals.userId= userToken.rows[0].url.userId

  next()
}
export async function getUser(req,res,next){
   const {authorization} = req.headers
   const token = authorization?.replace("Bearer ", "")
   if(!token) return res.status(401).send({ message: "Unauthorized" })
   const session = await db.query('SELECT * FROM sessions WHERE token = $1', [token])
   if(session.rows.length===0) return res.status(401).send({ message: "Session Not Found" })
   
   const userId= session.rows[0].userId
  res.locals.userId= userId
   next()


}
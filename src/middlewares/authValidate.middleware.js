import {db} from "../database/database.connection.js";
export async function validateShorten(req,res,next){
    const {authorization} = req.headers

    const token = authorization?.replace("Bearer ", "")
    
    if(!token) return res.status(401).send({ message: "Unauthorized" })

    const session = await db.query('SELECT * FROM sessions WHERE token = $1', [token])
    console.log("userIdV",session.rows[0].userId)
    if(session.rows.length===0) return res.status(401).send({ message: "Not Found" })
    
    res.locals.session = session.rows[0].userId
    next()
}
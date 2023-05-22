import {db} from "../database/database.connection.js";
import { nanoid } from "nanoid";
export  async function postShorten(req, res) {
  const { url } = req.body;
  const { session } = res.locals;
  req.body= nanoid(6)
  const shortUrl = req.body
  try {
    const userId = session;
    
    await db.query(
      `INSERT INTO urls ("originalUrl", "shortCode", "userId") VALUES ($1, $2, $3)`,
      [url, shortUrl, userId]
    );
    const body = await db.query(
      `SELECT urls.id, urls."shortCode" FROM urls WHERE "shortCode"=$1 AND "userId"=$2`,
      [shortUrl, userId]
    );
    
    res.status(201).send(body.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}
export async function getUrlById(req,res){
  const {id}= req.params;

 try{
   const body = await db.query(`SELECT * FROM urls WHERE id=$1`,[id]);
   if(!body.rows.length ===0) return res.status(404).send({ message: "Not Found" });

   res.status(200).send(body.rows[0]);

 }catch(err){
   console.log(err);
   res.status(500).send(err.message);
 }
}
export async function redirectUrl(req,res){
  const {shortCode}= req.params;

   try{
     const result = await db.query(`SELECT * FROM urls WHERE "shortCode"=$1`,[shortCode]);
     if (result.rows.length === 0) return res.status(404).send({ message: "Not Found" });

     const url = result.rows[0].originalUrl;
     const visitCount = result.rows[0].visitCount + 1;
 
     await db.query(
       `UPDATE urls SET "shortCode" = $1 WHERE "visitCount" = $2`,
       [shortCode, visitCount]
     );
res.redirect(url)
   }catch(err){
     console.log(err);
   }

}